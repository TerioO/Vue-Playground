<script setup lang="ts">
import "primeicons/primeicons.css";
import AppLayout from "./components/Layout/AppLayout.vue";
</script>

<template>
    <AppLayout>
        <RouterView />
    </AppLayout>
</template>

<style lang="scss">
@import "./styles/defaults.scss";
</style>
