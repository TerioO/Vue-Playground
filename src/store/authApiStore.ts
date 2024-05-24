import { defineStore } from "pinia";
import { useDelay } from "../hooks/useDelay";
import { useAuthStore } from "./authStore";
import { useApiStore } from "./apiStore";
import { useToast } from "primevue/usetoast";
import { useStore } from "./useStore";

interface IPayloadRegister {
    username: string;
    password: string;
}
export interface IResLogin {
    accessToken: string;
}
export interface IResMessage {
    message: string
}
export const useAuthApiStore = defineStore("auth-api", () => {
    const { auth, setToken, logout: LOGOUT } = useAuthStore();
    const { resetStore } = useStore();
    const { baseQuery, baseQueryWithAuth } = useApiStore();
    const toast = useToast();

    const login = async (payload: IPayloadRegister) => {
        await useDelay(1);
        const res = await baseQuery<IResLogin>("/auth/login", {
            method: "POST",
            data: payload
        });
        setToken(res.data.accessToken);
        resetStore();
        toast.add({ 
            severity: "success",
            summary: "Success" ,
            detail: `Logged in as "${auth.userInfo.username}"`,
            life: 3000
        })
        return res;
    }

    const register = async (payload: IPayloadRegister) => {
        await useDelay(1);
        const res = await baseQuery<IResMessage>("/auth/register", {
            method: "POST",
            data: payload
        });
        return res;
    }

    // REFRESH:
    const refresh = async () => {
        const res = await baseQueryWithAuth<IResLogin>("/auth/refresh", {
            method: "GET"
        })
        setToken(res.data.accessToken);
        return res;
    }

    // LOGOUT:
    const logout = async () => {
        const res = await baseQueryWithAuth<IResMessage>("/auth/logout", {
            method: "GET"
        });
        LOGOUT();
        toast.add({
            severity: "success",
            summary: "Success",
            detail: "Logged out successfully!",
            life: 3000,
        })
        return res;
    }

    return { login, register, refresh, logout }
});