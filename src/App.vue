<script setup lang="ts">
import "primeicons/primeicons.css";
import AppLayout from "./components/Layout/AppLayout.vue";
import { usePrimeVue } from "primevue/config";

const PV = usePrimeVue();
PV.changeTheme('', '', 'pv-theme-1', () => {});
</script>

<template>
    <AppLayout>
        <RouterView />
    </AppLayout>
</template>

<style lang="scss">
@import "./styles/defaults.scss";
</style>
