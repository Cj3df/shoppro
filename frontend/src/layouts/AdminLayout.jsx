import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/nav/Sidebar';
import Topbar from '../components/nav/Topbar';

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <div className="pl-64 flex flex-col min-h-screen">
                <Topbar />
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
