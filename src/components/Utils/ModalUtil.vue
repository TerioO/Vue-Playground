<script setup lang="ts">
import { watch, ref } from "vue";
import Button from "primevue/button";

const props = defineProps<{
    open: boolean;
    containerClass?: string;
}>();

const modalRef = ref<HTMLDivElement | null>(null);
const emit = defineEmits<{
    (e: "onClose", open: boolean): void;
}>();

function onClose(e: Event) {
    if (e.target == modalRef.value) {
        emit("onClose", false);
    }
}

watch(
    () => props.open,
    (open) => {
        if (open) document.body.classList.add("modal-open");
        else document.body.classList.remove("modal-open");
    }
);
</script>

<template>
    <Teleport to="body">
        <div
            v-if="open"
            @click="onClose"
            ref="modalRef"
            :class="$style.modalBg"
        >
            <div :class="$style.modalContainer">
                <div :class="$style.modalHeader">
                    <Button
                        icon="pi pi-times"
                        severity="secondary"
                        rounded
                        outlined
                        @click="$emit('onClose', false)"
                    />
                </div>
                <div :class="containerClass">
                    <slot>Slot template, your modal is empty</slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style module lang="scss">
@import "../../styles/ct.scss";
.modalBg {
    $bg-color: rgba(27, 27, 27, 0.877);

    overflow: hidden;
    position: fixed;
    z-index: 2023;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: $bg-color;
    display: flex;
    justify-content: center;
    align-items: center;

    .modalContainer {
        z-index: 2024;
        background-color: $th-bg;
        color: $th-color;
        max-width: 90vw;
        padding: 1rem;
        border-radius: 0.25rem;
        box-shadow: 0px 0px 48px -16px darken($bg-color, 15%);

        .modalHeader {
            display: flex;
            > button {
                margin-left: auto;
            }
        }
    }
}
</style>
