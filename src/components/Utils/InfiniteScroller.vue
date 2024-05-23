<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted, withDefaults } from "vue";

type Direction = "Up" | "Down";

const props = withDefaults(
    defineProps<{
        containerClass?: string;
        direction?: Direction;
        distance?: number;
        updateFn: () => void;
    }>(),
    {
        direction: "Down",
        distance: 10,
    }
);

const container = ref<HTMLDivElement | null>(null);
const state = reactive({
    loading: false,
    windowResize: false,
});

const conditionToRefetch = () => {
    // The scroller container bottom coordinate is smaller than the height of the viewport
    // And the scroller is in the viewport
    const pos = (container.value as HTMLElement)?.getBoundingClientRect()
        .bottom;
    const isInViewport = pos < window.innerHeight && pos > 0;
    const distFromViewportBottom = window.innerHeight - props.distance;
    return isInViewport && pos < distFromViewportBottom;
};

// Watch for the scroll event on the window and trigger the data refetches:
let prevScroll = 0;
function eventLoop(_e: Event) {
    if (state.loading) return; // If there is a data fetch in progress, immediately exit.
    const dir: Direction = window.scrollY > prevScroll ? "Down" : "Up";
    prevScroll = window.scrollY;
    if (dir === props.direction && conditionToRefetch()) {
        // Allow a single fetch at a time, and loading state is removed whenever content is addedd in
        // the scroller, the check is done using ResizeObserver API.
        if (!state.loading) {
            state.loading = true;
            props.updateFn();
            console.log("Infinite Scroller: updating @eventLoop");
        }
    }
}

/* Context:
 When data is fetched, it should be rendered inside the scroller and it's height should change accordingly.
 This will trigger the resizeObserver which will immediately set the loading state to false and allow new data to be fetched again
 It will also check if the data provided has increased the size of the scroller beyond that of the viewport
 If the scrollers height is smaller that the viewport, it will fetch new data until the scroller is taller than the viewport

 Basically I don't want to be in state where not enough data is sent from the updateFn and the user is never able to scroll down
 thus being unable to trigger the scroll event and fulfill the condition to fetch data.

 DANGER: if for some reason your updateFn() doesn't insert new data (maybe there is no more data to fetch)
 the updates end there because loading state will be set to true in the main event loop and since no data is
 fetched to be inserted in the scoller --> it doesn't change size --> loading state is never reset.
 In this case you should render a message on the FE like: "No more data to fetch". */
let prevHeight = 0;
const scrollerResizeObserver = new ResizeObserver((entries) => {
    state.loading = false;
    for (const entry of entries) {
        if (entry.target) {
            if (state.windowResize && prevHeight === entry.target.getBoundingClientRect().height) {
                state.windowResize = false;
                return;
            }
            if (conditionToRefetch()) {
                prevHeight = entry.target.getBoundingClientRect().height;
                state.loading = true;
                props.updateFn();
                console.log("Infinite Scroller: updating @resizeObserver");
            }
        }
    }
});

function windowResizeEvent() {
    state.windowResize = true;
}

onMounted(() => {
    window.addEventListener("scroll", eventLoop);
    window.addEventListener("resize", windowResizeEvent);
    if (container.value) {
        // This event automatically fires when scollerComponent mounts!
        scrollerResizeObserver.observe(container.value);
    }
});
onUnmounted(() => {
    window.removeEventListener("scroll", eventLoop);
    window.removeEventListener("resize", windowResizeEvent);
    scrollerResizeObserver.disconnect();
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
