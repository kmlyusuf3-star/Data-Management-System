import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, UserPlus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

export default function DashboardPage() {
  const [summary, setSummary] = useState({ total: 0, active: 0, inactive: 0, newThisMonth: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State baru untuk menyimpan pilihan periode bulan (default: 6 bulan)
  const [chartPeriod, setChartPeriod] = useState(6);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [summaryRes, chartRes] = await Promise.all([
          api.get('/dashboard/summary'),
          // Memanggil API grafik dengan mengirimkan parameter jumlah bulan yang dipilih
          api.get(`/dashboard/customer-growth?months=${chartPeriod}`)
        ]);
        
        setSummary(summaryRes.data.data);
        setChartData(chartRes.data.data);
        setError(null);
      } catch (err) {
        setError('Gagal mengambil data dari server. Pastikan Backend menyala.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [chartPeriod]); // Efek ini akan otomatis dijalankan ulang setiap kali chartPeriod diubah

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat data dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* 4 Kartu Ringkasan Atas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users size={24} /></div>
          <div>
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold text-gray-800">{summary.total}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><UserCheck size={24} /></div>
          <div>
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-gray-800">{summary.active}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg"><UserX size={24} /></div>
          <div>
            <p className="text-sm text-gray-500">Inactive</p>
            <p className="text-2xl font-bold text-gray-800">{summary.inactive}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><UserPlus size={24} /></div>
          <div>
            <p className="text-sm text-gray-500">New This Month</p>
            <p className="text-2xl font-bold text-gray-800">{summary.newThisMonth}</p>
          </div>
        </div>

      </div>

      {/* Area Grafik (Chart) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Customer Growth</h2>
          
          {/* Dropdown Filter Periode Grafik */}
          <select 
            value={chartPeriod}
            onChange={(e) => setChartPeriod(Number(e.target.value))}
            className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-3 py-1 outline-none cursor-pointer focus:border-blue-500 text-sm font-medium"
          >
            <option value={3}>Last 3 Months</option>
            <option value={6}>Last 6 Months</option>
            <option value={12}>Last 12 Months</option>
          </select>
        </div>
        
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
              <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}