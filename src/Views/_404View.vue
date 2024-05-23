<script setup lang="ts">
</script>

<template>
    <div :class="$style._404">
        <h1>404 - Page Not Found</h1>
        <p>Navigate to <RouterLink to="/">home</RouterLink></p>
    </div>
</template>

<style module lang="scss">
._404 {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    > h1, p {
        text-align: center;
    }
}
</style>
