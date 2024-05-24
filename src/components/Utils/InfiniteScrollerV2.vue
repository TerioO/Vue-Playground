<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted, withDefaults } from "vue";

const props = withDefaults(
    defineProps<{
        containerClass?: string;
        updateFn: () => void;
        // The element to compare intersection against, defaults to viewport
        root?: Element | null;
        // Offsets on the root that trigger the event earlier/later
        // A margin of 100px will trigger when the observed element is outside the viewport by 100px;
        // A margin of -100px will trigger when the observed element is inside the viewport minus 100px;
        rootMargin?: string;
        // Between 0.0 and 1.0 (0.0 --> 1px intersecting the viewport triggers event)
        // threshold = 1 --> The entire observed element must be viewable to trigger the event
        // threshold = 0.5 --> 50% of the observed element must be viewable
        // threshold = 0 --> If 1px (think of it as the 1st px entres the viewport) is visible, trigger the event
        threshold?: number;
    }>(),
    {
        root: null,
        rootMargin: "0px 0px 0px 0px",
        threshold: 0,
    }
);

const container = ref<HTMLDivElement | null>(null);
const state = reactive<{
    loading: boolean;
    lastNode: Element | null;
}>({
    loading: false,
    lastNode: null,
});

const intObserver = new IntersectionObserver(
    (entries) => {
        if (state.loading) return;
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        props.updateFn();
        state.loading = true;
    },
    {
        root: props.root,
        rootMargin: props.rootMargin,
        threshold: props.threshold,
    }
);

const mutObserver = new MutationObserver((mutationList) => {
    const lastMutationRecord = mutationList[mutationList.length - 1];
    const { addedNodes } = lastMutationRecord;
    if (!state.lastNode) {
        state.lastNode = addedNodes[addedNodes.length - 1] as Element;
    } else {
        intObserver.unobserve(state.lastNode);
    }
    intObserver.observe(addedNodes[addedNodes.length - 1] as Element);
    console.log(addedNodes[addedNodes.length - 1]);
    if (state.loading) state.loading = false;
});

onMounted(() => {
    if (container.value) {
        mutObserver.observe(container.value, { childList: true });
    }
    props.updateFn();
    state.loading = true;
});
onUnmounted(() => {
    if (container.value) {
        mutObserver.disconnect();
    }
    intObserver.disconnect();
});
</script>

<template>
    <div
        ref="container"
        :class="containerClass"
    >
        <slot> </slot>
    </div>
</template>

<style module lang="scss">
@import "../../styles/ct.scss";
</style>
