export interface Asset {
    id: string;
    originalName: string;
    mimeType: string;
    size: number;
    objectName: string;
    status: 'processing' | 'ready' | 'failed';
    uploadDate: string;
    thumbnail?: string;
    width?: number;
    height?: number;
    duration?: number;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    pagination?: Pagination;
}

export interface Stats {
    totalAssets: number;
    totalImages: number;
    totalVideos: number;
    storageUsed?: number; // Optional, as backend might not implement it fully yet
}
