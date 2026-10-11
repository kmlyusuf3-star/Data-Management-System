import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Download } from 'lucide-react';
import api from '../services/api';
import CustomerForm from '../components/customers/CustomerForm';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  
  // State baru untuk Filter dan Sort
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Panggil API dengan tambahan filter dan sort
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/customers?page=${page}&limit=10&search=${search}&status=${filterStatus}&sort=${sortBy}`);
      setCustomers(res.data.data);
      setTotalPages(res.data.pagination.totalPages || 1);
    } catch (error) {
      console.error("Gagal mengambil data pelanggan", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirm = window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?');
    if (isConfirm) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers(); 
      } catch (error) {
        alert('Gagal menghapus pelanggan');
        console.error(error);
      }
    }
  };

  const handleExportCSV = async () => {
    try {
      // Export akan mengikuti filter dan pencarian yang sedang aktif
      const res = await api.get(`/customers?page=1&limit=1000&search=${search}&status=${filterStatus}&sort=${sortBy}`);
      const exportData = res.data.data;
      let csvContent = "Name,Email,Phone,Company,Status\n";
      exportData.forEach(c => {
        csvContent += `"${c.full_name}","${c.email}","${c.phone}","${c.company || ''}","${c.status}"\n`;
      });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "Data_Pelanggan.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Gagal meng-export data");
    }
  };

  // Memicu API ulang jika search, page, status, atau sort berubah
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCustomers();
    }, 500);
    return () => clearTimeout(delay);
  }, [search, page, filterStatus, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Bagian Atas: Judul dan Tombol Tambah */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
        <div className="flex gap-3">
          <button onClick={handleExportCSV} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download size={20} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button onClick={() => { setEditingCustomer(null); setIsFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus size={20} />
            <span className="hidden sm:inline">Add Customer</span>
          </button>
        </div>
      </div>

      {/* Bagian Tengah: Kolom Pencarian & Filter */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        
        {/* Search Bar */}
        <div className="flex-1 flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            className="w-full outline-none text-gray-700 bg-transparent"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {/* Kotak Dropdown Filter & Sort */}
        <div className="flex gap-3">
          <select 
            value={filterStatus} 
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-4 py-2 outline-none cursor-pointer focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-4 py-2 outline-none cursor-pointer focus:border-blue-500"
          >
            <option value="newest">Newest Added</option>
            <option value="oldest">Oldest Added</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Bagian Tabel Data */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Memuat data...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">Belum ada pelanggan yang ditemukan.</td></tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800">{c.full_name}</td>
                    <td className="p-4 text-gray-600">{c.email}</td>
                    <td className="p-4 text-gray-600">{c.phone}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center gap-3">
                      <button onClick={() => { setEditingCustomer(c); setIsFormOpen(true); }} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
          <span>Page {page} of {totalPages === 0 ? 1 : totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
      
      <CustomerForm isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingCustomer(null); }} onSuccess={fetchCustomers} initialData={editingCustomer} />
    </div>
  );
}