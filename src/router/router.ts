import { createRouter, createWebHistory } from "vue-router";
import { guardAllowRoles } from "./guards";
import HomeView from "../Views/HomeView.vue";
import { useAuthStore } from "../store/authStore";
import { useAuthApiStore } from "../store/authApiStore";
import { AxiosError } from "axios";

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // Everyone Access Routes:
        { path: "/", component: HomeView },
        { path: "/login", component: () => import("../Views/LoginView.vue") },
        { path: "/register", component: () => import("../Views/RegisterView.vue") },

        // Protected Routes:
        {
            path: "/profile",
            beforeEnter: guardAllowRoles(["USER", "ADMIN", "OWNER"]),
            component: () => import("../Views/ProfileView.vue")
        },
        {
            path: "/users-list",
            beforeEnter: guardAllowRoles(["USER", "ADMIN", "OWNER"]),
            component: () => import("../Views/UsersList.vue")
        },
        {
            path: "/update-user/:id",
            beforeEnter: guardAllowRoles(["ADMIN", "OWNER"]),
            component: () => import("../Views/UpdateUser.vue")
        },

        // 404 Page:
        { path: "/:pathMatch(.*)*", component: () => import("../Views/_404View.vue") }
    ]
})

// Init the auth state if user has selected the remember me function:
// This ensures navigation works as expected on new tabs/windows of protected routes
router.beforeEach(async () => {
    const { auth: { token, rememberMe }, setToken } = useAuthStore();
    const { refresh } = useAuthApiStore();

    if (rememberMe && !token) {
        try {
            const res = await refresh();
            if (res.data.accessToken) {
                setToken(res.data.accessToken);
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data.message);
            }
        }
    }
})