<script setup lang="ts">
import AppFooter from "./AppFooter.vue";
import AppHeader from "./AppHeader.vue";
import Toast from "primevue/toast";
</script>

<template>
    <div :class="$style.layout">
        <AppHeader />
        <Toast position="top-left" />
        <main :class="$style.main">
            <slot>Slot for AppLayout.vue</slot>
        </main>
        <AppFooter />
    </div>
</template>

<style module lang="scss">
div.layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    main.main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
    }
}
</style>
