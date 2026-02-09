// Third-party imports
import axios from "axios";
import { toast } from "sonner";

// Utility imports
import { authUtils } from "../utils/cookieManagement";
import { urlPaths } from "@/constants/urlPaths";
import { apiConfig } from "@/config/apiConfig";
import { handleRefreshToken } from "./handleRefreshToken";
import { httpCodes } from "@/constants/httpCodes";

// Create axios instance
const apiClient = axios.create(apiConfig);

{
    /**
     * @description Request interceptor to add the Authorization header
     * with the access token if available.
     */
}
apiClient.interceptors.request.use(
    (config) => {
        const token = authUtils.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

{
    /**
     * @description Response interceptor to handle token expiration
     * and refresh the token if necessary.
     */
}
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        // Only toast error if it's NOT a 401 (which we try to handle silently first)
        // or if we already retried and it still failed
        if (error.response?.status !== httpCodes.UNAUTHORIZED) {
            toast.error(error.response?.data?.message || "An error occurred");
        }

        if (
            error.response?.status === httpCodes.UNAUTHORIZED &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await handleRefreshToken();

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                authUtils.clearAuth();
                window.location.href = urlPaths.authentication.login;
                return Promise.reject(refreshError);
            }
        }

        // If it's a 401 and we already retried, make sure to reject
        return Promise.reject(error);
    }
);

export default apiClient;
