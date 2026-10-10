import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';

// TAMBAHAN: Kita menambahkan prop "initialData" untuk menampung data yang mau diedit
export default function CustomerForm({ isOpen, onClose, onSuccess, initialData }) {
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', company: '', status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // TAMBAHAN: Efek ini berjalan otomatis saat form dibuka. 
  // Jika ada "initialData", isi form dengan data tersebut (Mode Edit).
  // Jika kosong, kosongkan form (Mode Tambah Baru).
  useEffect(() => {
    if (initialData) {
      setFormData({
        full_name: initialData.full_name,
        email: initialData.email,
        phone: initialData.phone,
        company: initialData.company || '',
        status: initialData.status
      });
    } else {
      setFormData({ full_name: '', email: '', phone: '', company: '', status: 'Active' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (initialData) {
        // Jika sedang Mode Edit, kirim ke API Edit (PUT)
        await api.put(`/customers/${initialData.id}`, formData);
      } else {
        // Jika sedang Mode Tambah Baru, kirim ke API Tambah (POST)
        await api.post('/customers', formData);
      }
      
      onSuccess(); // Refresh tabel
      onClose();   // Tutup form
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          {/* Judul form berubah otomatis */}
          <h2 className="text-lg font-bold text-gray-800">
            {initialData ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input required type="text" className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
              value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input required type="email" className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input required type="text" className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
              value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
              value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Saving...' : (initialData ? 'Update Customer' : 'Save Customer')}
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
}