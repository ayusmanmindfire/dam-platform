import apiClient from "@/api/apiClient";
import { urlPaths } from "@/constants/urlPaths";
import type { ApiResponse, Asset, Stats } from "@/types";

export const assetService = {
    upload: async (files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        const response = await apiClient.post(urlPaths.upload, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    getAll: async (params: { page: number; limit: number; type?: string; search?: string }) => {
        const queryParams = new URLSearchParams({
            page: params.page.toString(),
            limit: params.limit.toString(),
        });
        if (params.type) queryParams.append('type', params.type);
        if (params.search) queryParams.append('search', params.search);

        const response = await apiClient.get<ApiResponse<Asset[]>>(`${urlPaths.assets}?${queryParams.toString()}`);
        return response.data;
    },

    getStats: async () => {
        // Note: The backend route is /admin/stats, which might need to be added to urlPaths or handled here
        // Assuming urlPaths.dashboard might map to /admin/stats or we just use the path directly
        const response = await apiClient.get<{ success: boolean; stats: Stats }>('/admin/stats');
        return response.data.stats;
    }
};
