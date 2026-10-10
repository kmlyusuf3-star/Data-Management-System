import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../services/api';
import CustomerForm from '../components/customers/CustomerForm';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Fungsi untuk memanggil API mengambil daftar pelanggan
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/customers?page=${page}&limit=10&search=${search}`);
      setCustomers(res.data.data);
      setTotalPages(res.data.pagination.totalPages || 1);
    } catch (error) {
      console.error("Gagal mengambil data pelanggan", error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menghapus pelanggan
  const handleDelete = async (id) => {
    const isConfirm = window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?');
    if (isConfirm) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers(); // Refresh tabel otomatis setelah berhasil dihapus
      } catch (error) {
        alert('Gagal menghapus pelanggan');
        console.error(error);
      }
    }
  };

  // useEffect ini akan otomatis dipanggil tiap kali 'page' atau 'search' berubah
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCustomers();
    }, 500);
    return () => clearTimeout(delay);
  }, [search, page]);

  return (
    <div className="space-y-6">
      {/* Bagian Atas: Judul dan Tombol Tambah */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
        <button 
          onClick={() => {
            setEditingCustomer(null); // Pastikan kosong saat tambah baru
            setIsFormOpen(true);
          }} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Bagian Tengah: Kolom Pencarian */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search name, email, phone..."
          className="w-full outline-none text-gray-700"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Kembali ke halaman 1 kalau pencarian diubah
          }}
        />
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
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">Belum ada pelanggan yang ditemukan.</td>
                </tr>
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
                      {/* PERBAIKAN 1: Tombol Edit sekarang berfungsi */}
                      <button 
                        onClick={() => {
                          setEditingCustomer(c);
                          setIsFormOpen(true);
                        }} 
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Navigasi Halaman (Pagination) */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
          <span>Page {page} of {totalPages === 0 ? 1 : totalPages}</span>
          <div className="flex gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button 
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      
      {/* PERBAIKAN 2: Modal Form sekarang menerima initialData dan membersihkan state saat ditutup */}
      <CustomerForm 
        isOpen={isFormOpen} 
        onClose={() => {
          setIsFormOpen(false);
          setEditingCustomer(null);
        }} 
        onSuccess={fetchCustomers} 
        initialData={editingCustomer}
      />
    </div>
  );
}