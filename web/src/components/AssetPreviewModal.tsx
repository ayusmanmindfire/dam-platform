import React from 'react';
import { X, Download } from 'lucide-react';

interface Asset {
    id: string;
    originalName: string;
    mimeType: string;
}

interface AssetPreviewModalProps {
    asset: Asset | null;
    onClose: () => void;
}

export const AssetPreviewModal: React.FC<AssetPreviewModalProps> = ({ asset, onClose }) => {
    if (!asset) return null;

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    const downloadUrl = `${apiUrl}/assets/download/${asset.id}`;
    const isImage = asset.mimeType.startsWith('image/');
    const isVideo = asset.mimeType.startsWith('video/');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold truncate flex-1 pr-4">{asset.originalName}</h3>
                    <div className="flex items-center gap-2">
                        <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                            title="Download"
                        >
                            <Download size={20} />
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                            title="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-4 min-h-[300px]">
                    {isImage ? (
                        <img
                            src={downloadUrl}
                            alt={asset.originalName}
                            className="max-w-full max-h-full object-contain shadow-md"
                        />
                    ) : isVideo ? (
                        <video
                            src={downloadUrl}
                            controls
                            autoPlay
                            className="max-w-full max-h-[70vh] shadow-md"
                        />
                    ) : (
                        <div className="text-center text-gray-500">
                            <p className="text-lg mb-2">Preview not available</p>
                            <p className="text-sm">File type: {asset.mimeType}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
