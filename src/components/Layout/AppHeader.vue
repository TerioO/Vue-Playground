<script setup lang="ts">
import NavMenu from "../Utils/NavMenu.vue";
import Avatar from "primevue/avatar";
</script>

<template>
    <header>
        <div :class="$style.header">
            <RouterLink to="/">
                <Avatar
                    icon="pi pi-home"
                    style="color: black"
                    size="large"
                    shape="circle"
                />
            </RouterLink>
            <div :class="$style.nav">
                <NavMenu />
            </div>
        </div>
    </header>
</template>

<style module lang="scss">
@import "../../styles/ct.scss";

header {
    div.header {
        max-width: $app-max-width;
        margin: 0 auto;
        display: flex;
        padding: 1rem;
        .nav {
            margin-left: auto;
        }
    }
}
</style>
