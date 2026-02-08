import React from 'react';

export const Settings: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Settings</h1>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <p className="text-gray-600">Application settings will safely appear here.</p>
                <div className="mt-4 p-4 bg-gray-50 rounded text-sm font-mono">
                    <p>API URL: {import.meta.env.VITE_API_URL || 'http://localhost:4000'}</p>
                    <p>Version: 1.0.0</p>
                </div>
            </div>
        </div>
    );
};
