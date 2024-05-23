<script setup lang="ts">
import { ref, watch } from "vue";
import { useAuthStore } from "../../store/authStore";
import { useFetchWrapper } from "../../hooks/useFetchWrapper";
import { useAuthApiStore, IResMessage } from "../../store/authApiStore";
import { useRouter } from "vue-router";
import Avatar from "primevue/avatar";
import Menu from "primevue/menu";
import { MenuItem } from "primevue/menuitem";

// Refs/State:
const router = useRouter();
const { auth } = useAuthStore();
const { loading, data, trigger } = useFetchWrapper<IResMessage>();
const { logout } = useAuthApiStore();

// Handlers:
function toggleMenu(e: Event) {
    menuRef.value.toggle(e);
}

function handleLogout() {
    if (!loading.value) {
        trigger(logout);
    }
}

// Watchers:
watch(data, () => {
    if (data.value?.ok) router.push("/");
});

// Template:
const menuRef = ref<any | null>(null);
const menuItems = ref<MenuItem[]>([
    {
        visible: () => ["ADMIN", "OWNER"].includes(auth.userInfo.role as string),
        label: "Admin Features",
        items: [
            { 
                label: "Users List", 
                icon: "pi pi-list", 
                route: "/users-list",

            },
        ],
    },
    {
        label: "Profile",
        items: [
            {
                label: "Settings",
                icon: "pi pi-cog",
                route: "/profile",
                visible: () => Boolean(auth.token),
            },
            {
                label: "Login",
                icon: "pi pi-sign-in",
                route: "/login",
            },
            {
                label: "Register",
                icon: "pi pi-user-plus",
                route: "/register",
            },
            {
                label: "Logout",
                icon: "pi pi-sign-out",
                visible: () => Boolean(auth.token),
                command: () => {
                    handleLogout();
                },
            },
        ],
    },
]);
</script>

<template>
    <Avatar
        shape="circle"
        size="large"
        :class="$style.avatar"
        :icon="auth.userInfo.username || 'pi pi-user'"
        :label="auth.userInfo.username && auth.userInfo.username[0]"
        @click="toggleMenu"
    />
    <Menu
        ref="menuRef"
        :popup="true"
        :model="menuItems"
    >
        <template #item="{ item, props }">
            <RouterLink
                v-if="item.route"
                :to="item.route"
                :class="$style.routerLink"
            >
                <span :="props.action">
                    <span :class="item.icon"></span>
                    <span style="margin-left: 0.5rem">{{ item.label }}</span>
                </span>
            </RouterLink>
            <span
                v-else
                :="props.action"
            >
                <span :class="item.icon"></span>
                <span style="margin-left: 0.5rem">{{ item.label }}</span>
            </span>
        </template>
    </Menu>
</template>

<style module lang="scss">
.avatar {
    cursor: pointer;
}
.routerLink {
    text-decoration: none;
}
</style>
