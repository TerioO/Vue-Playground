import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import { useRouter } from "vue-router";
import axios, { AxiosError } from "axios";
import { useToast } from "primevue/usetoast";

let baseURL: string = "http://localhost:3000";
if (import.meta.env.PROD) {
    baseURL = "";
}

export const useApiStore = defineStore("api", () => {
    const { auth, setToken, logout } = useAuthStore();
    const toast = useToast();
    const router = useRouter();
    /**
     * Axios instance with `baseURL` set
     */
    const baseQuery = axios.create({
        baseURL,
        withCredentials: true
    })

    /**
     * Axios instance with `Authorization` header set
     */
    const baseQueryWithAuth = axios.create({
        baseURL,
        withCredentials: true
    })
    // Before every request is made, set the Authorization header
    baseQueryWithAuth.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${auth.token}`
        return config;
    }, (error) => {
        return Promise.reject(error)
    })
    // After every response, check if a 403 status appears (Auth Session Expires)
    // The backend should send 403 only when token expires!
    baseQueryWithAuth.interceptors.response.use((config) => {
        return config;
    }, async (error) => {
        if (error instanceof AxiosError) {
            // Grab the initial request (config: which was made with an expired token) and the response
            const { config, response: res } = error;
            if (res?.status === 403) { // Backend sends a 403 on any route with an epxired accessToken
                try {
                    // Hit the refresh route and request a new accessToken
                    const refreshResult = await baseQuery<{ accessToken: string }>("/auth/refresh");

                    // If the refresh token hasn't expired, it will return a new accessToken
                    setToken(refreshResult.data.accessToken);

                    // Reset the Authorization header with the new token
                    if (config) {
                        config.headers.Authorization = `Bearer ${auth.token}`;

                        // Try again the original request
                        return axios(config);
                    }
                }
                // If the refresh route fails, inform the user that a login is required
                // A login will generate a new refreshToken in the backend
                catch (refreshError) {
                    logout();
                    router.push("/login"); // Redirect to login
                    toast.add({
                        severity: "error",
                        summary: "Session expired",
                        detail: "Please login to your account to refresh your session",
                        life: 3000
                    })
                    return Promise.reject(refreshError);
                    // This error will be parsed in useFetchWrapper 
                    // The API sends on every error a { message: string; isError: true } object
                }
            }
            else return Promise.reject(error);
        }
    })
    return { baseQuery, baseQueryWithAuth }
})