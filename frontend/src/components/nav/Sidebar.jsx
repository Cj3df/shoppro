import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Layers,
    Users,
    Settings,
    BarChart3
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
    const { user } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Inventory', path: '/admin/inventory', icon: Layers }, // Or BarChart3
        { name: 'Customers', path: '/admin/users', icon: Users, roles: ['admin'] },
        // { name: 'Settings', path: '/admin/settings', icon: Settings, roles: ['admin'] },
    ];

    return (
        <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-30">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <h1 className="text-xl font-bold tracking-tight text-white">
                    ShopMaster <span className="text-sky-500">Pro</span>
                </h1>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    if (item.roles && !item.roles.includes(user?.role)) return null;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${isActive
                                    ? 'bg-sky-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            <item.icon size={18} />
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>

            {/* User info */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-sky-500 flex items-center justify-center text-xs font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">{user?.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
