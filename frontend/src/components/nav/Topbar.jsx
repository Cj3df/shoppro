import React from 'react';
import { LogOut, Bell, Search } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-8 flex items-center justify-between">
            {/* Search (Placeholder) */}
            <div className="relative w-96 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Topbar;
