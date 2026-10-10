import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  // Fungsi kecil untuk mewarnai tombol menu yang sedang aktif
  const isActive = (path) => location.pathname === path ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-600 hover:bg-gray-50";

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/')}`}>
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </Link>
          
          <Link to="/customers" className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive('/customers')}`}>
            <Users size={20} />
            <span>Customers</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Outlet adalah tempat di mana isi halaman akan berganti-ganti */}
        <Outlet /> 
      </main>
    </div>
  );
}