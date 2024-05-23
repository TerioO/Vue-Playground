import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { reactive } from "vue";
import { useStore } from "./useStore";
import { InvalidTokenError, jwtDecode } from "jwt-decode";
import { IAccessToken } from "../types/types";

interface Auth {
    token: string;
    userInfo: IAccessToken["userInfo"];
    rememberMe: boolean;
}

// Create localStorage.rememberMe = true if it doesn't exist
// Otherwise, grab w/e value exists and return it in a ref
const rememberMeState = useLocalStorage("rememberMe", true)
const initialState: Auth = {
    token: "",
    userInfo: {
        id: "",
        username: "",
        role: undefined
    },
    rememberMe: rememberMeState.value
}
const auth = reactive<Auth>({...initialState});

export const useAuthStore = defineStore("auth", () => {
    const { resetStore } = useStore();
    function setToken(token: string) {
        try {
            const decoded = jwtDecode<IAccessToken>(token);
            auth.token = token;
            auth.userInfo = decoded.userInfo;
        }
        catch (error) {
            if (error instanceof InvalidTokenError) { 
                console.log(`${error.name}: ${error.message}`) 
            }
            else console.log(error);
        }
        auth.token = token;
    }
    function toggleRememberMe(newValue: boolean){
        auth.rememberMe = newValue;
        // This will update localStorage as well:
        rememberMeState.value = auth.rememberMe;
    }
    function logout(){
        auth.token = "";
        auth.userInfo = initialState.userInfo;
        auth.rememberMe = false;
        rememberMeState.value = false;
        resetStore();
    }
    return { auth, setToken, logout, toggleRememberMe }
})