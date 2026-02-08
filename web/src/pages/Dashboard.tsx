import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import type { Stats } from '../types';
import { BarChart, PieChart, Activity, HardDrive } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color} text-white`}>
            {icon}
        </div>
    </div>
);

export const Dashboard: React.FC = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['stats'],
        queryFn: async () => {
            const res = await api.get<{ success: boolean; stats: Stats }>('/admin/stats');
            return res.data.stats;
        }
    });

    if (isLoading) {
        return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
    }

    if (!stats) return <div className="p-8 text-red-500">Failed to load stats.</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Assets"
                    value={stats.totalAssets}
                    icon={<HardDrive size={24} />}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Images"
                    value={stats.totalImages}
                    icon={<BarChart size={24} />}
                    color="bg-green-500"
                />
                <StatCard
                    title="Videos"
                    value={stats.totalVideos}
                    icon={<PieChart size={24} />}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Storage Used"
                    value="Calculated"
                    icon={<Activity size={24} />}
                    color="bg-orange-500"
                />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <p className="text-gray-500 text-sm">Activity functionality coming soon...</p>
            </div>
        </div>
    );
};
