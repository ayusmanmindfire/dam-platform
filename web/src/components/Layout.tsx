import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Upload, Settings, Menu, X } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Assets', path: '/assets', icon: FolderOpen },
        { name: 'Upload', path: '/upload', icon: Upload },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h1 className="text-xl font-bold text-gray-800">DAM Platform</h1>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden">
                        <X size={24} />
                    </button>
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:ml-64">
                {/* Header (Mobile Toggle) */}
                <header className="bg-white shadow-sm md:hidden">
                    <div className="flex items-center p-4">
                        <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
                            <Menu size={24} />
                        </button>
                        <span className="ml-4 font-semibold text-gray-800">Menu</span>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};
