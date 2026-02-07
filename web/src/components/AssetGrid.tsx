import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import type { Asset, ApiResponse } from '../types';
import { Search, Filter, Play, Image as ImageIcon, File } from 'lucide-react';

export const AssetGrid: React.FC = () => {
    const [page, setPage] = useState(1);
    const [type, setType] = useState<string>('');
    const [search, setSearch] = useState('');

    const { data, isLoading, error } = useQuery({
        queryKey: ['assets', page, type, search],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '12',
            });
            if (type) params.append('type', type);
            if (search) params.append('search', search);

            const res = await api.get<ApiResponse<Asset[]>>(`/assets?${params.toString()}`);
            return res.data;
        },
    });

    const assets = data?.data || [];
    const pagination = data?.pagination;

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Assets</h2>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        />
                    </div>

                    {/* Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
                            value={type}
                            onChange={(e) => { setType(e.target.value); setPage(1); }}
                        >
                            <option value="">All Types</option>
                            <option value="image">Images</option>
                            <option value="video">Videos</option>
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 py-10">Failed to load assets.</div>
            ) : assets.length === 0 ? (
                <div className="text-center text-gray-500 py-20 bg-gray-50 rounded-lg border border-dashed">
                    <p>No assets found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {assets.map((asset) => (
                        <div key={asset.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden group">
                            {/* Thumbnail Area */}
                            <div className="aspect-video bg-gray-100 relative overflow-hidden flex items-center justify-center">
                                {asset.thumbnail ? (
                                    <img
                                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/assets/download/${asset.id}?type=thumbnail`}
                                        alt={asset.originalName}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="text-gray-300">
                                        {asset.mimeType.startsWith('image/') ? <ImageIcon size={48} /> :
                                            asset.mimeType.startsWith('video/') ? <Play size={48} /> : <File size={48} />}
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <button
                                        className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium text-sm shadow-lg hover:bg-gray-100 transform translate-y-2 group-hover:translate-y-0 transition-all"
                                        onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/assets/download/${asset.id}`, '_blank')}
                                    >
                                        Download
                                    </button>
                                </div>

                                {asset.status === 'processing' && (
                                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded shadow">
                                        Processing...
                                    </div>
                                )}
                            </div>

                            {/* Info Area */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800 truncate" title={asset.originalName}>{asset.originalName}</h3>
                                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                    <span className="uppercase bg-gray-100 px-2 py-0.5 rounded">{asset.mimeType.split('/')[1]}</span>
                                    <span>{(asset.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {pagination && pagination.pages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-gray-600">Page {page} of {pagination.pages}</span>
                    <button
                        onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                        disabled={page === pagination.pages}
                        className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};
