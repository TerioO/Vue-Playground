<script setup lang="ts">
import { ref, onMounted, onUnmounted, withDefaults } from "vue";

type Direction = "Up" | "Down";

const props = withDefaults(
    defineProps<{
        containerClass?: string;
        direction?: Direction;
        distance?: number;
        intervalTime?: number;
        updateFn: () => void;
    }>(),
    {
        direction: "Down",
        distance: 10,
        intervalTime: 100,
    }
);
const container = ref<HTMLDivElement | null>(null);

const resizeObserver = new ResizeObserver((entries) => {
    for(const entry of entries){
        if(entry.target){
            const pos = entry.target.getBoundingClientRect().bottom;
            if(pos < window.innerHeight - props.distance){
                props.updateFn();
            }
        }
    }
})

// function updateUntilOverflows() {
//     const interval = setInterval(() => {
//         const pos = (container.value as HTMLElement).getBoundingClientRect()
//             .bottom;
//         if (pos < window.innerHeight - props.distance) {
//             props.updateFn();
//         } else clearInterval(interval);
//     }, props.intervalTime);
// }

let prevScroll = 0;
function eventLoop(_e: Event) {
    const dir: Direction = window.scrollY > prevScroll ? "Down" : "Up";
    prevScroll = window.scrollY;
    const pos = (container.value as HTMLElement)?.getBoundingClientRect()
        .bottom;
    if (dir === props.direction) {
        const isInViewport = pos < window.innerHeight && pos > 0;
        const distFromViewportBottom = window.innerHeight - props.distance;
        if (isInViewport && pos < distFromViewportBottom) {
            props.updateFn();
        }
    }
}

onMounted(async () => {
    window.addEventListener("scroll", eventLoop);
    if(container.value) resizeObserver.observe(container.value);
    props.updateFn();
});
onUnmounted(() => {
    window.removeEventListener("scroll", eventLoop);
});
</script>

<template>
    <div
        ref="container"
        :class="containerClass"
    >
        <slot>
            <p>
                This scroller will run an updateFn() every time the bottom
                position of the container is smaller than the window height
                minus a distance
            </p>
        </slot>
    </div>
</template>

<style module lang="scss">
@import "../../styles/ct.scss";
</style>
