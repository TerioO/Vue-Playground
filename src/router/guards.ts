import { NavigationGuard } from "vue-router";
import { useAuthStore } from "../store/authStore";
import { Roles } from "../types/types";
import { useToast } from "primevue/usetoast";

type GuardAllowRoles = (allowedRoles: Roles[]) => NavigationGuard;
export const guardAllowRoles: GuardAllowRoles = (allowedRoles) => {
    const guard: NavigationGuard = () => {
        const { auth } = useAuthStore();
        if (allowedRoles.includes(auth.userInfo.role as Roles)) {
            return true
        }
        else {
            const toast = useToast();
            toast.add({ 
                severity: "error", 
                summary: "Unauthorized by Role", 
                detail: `You don't have the required role to access route (Your role: ${auth.userInfo.role})`,
                life: 3000
            })
            return { path: "/" };
        }
    }
    return guard;
}