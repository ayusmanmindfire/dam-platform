import Cookies from "js-cookie";

const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const authUtils = {
    getAccessToken: () => Cookies.get(TOKEN_KEY),
    getRefreshToken: () => Cookies.get(REFRESH_TOKEN_KEY),
    setTokens: (accessToken: string, refreshToken: string) => {
        Cookies.set(TOKEN_KEY, accessToken);
        Cookies.set(REFRESH_TOKEN_KEY, refreshToken);
    },
    clearAuth: () => {
        Cookies.remove(TOKEN_KEY);
        Cookies.remove(REFRESH_TOKEN_KEY);
    },
    isAuthenticated: () => !!Cookies.get(TOKEN_KEY),
};
