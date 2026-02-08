export const apiConfig = {
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
};
