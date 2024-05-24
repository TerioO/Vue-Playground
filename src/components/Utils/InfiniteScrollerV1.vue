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
});
/**
 * What does the InfiniteScroller do?
 *  - It should loop ONLY through the data coming through updateFn()
 *  - Using "scroll" event, the bottom position of the scroller is checked against the viewport --> see *conditionToRefetch()*
 *  - When updateFn() triggers from "scroll" event, its sets: *loading=true*
 *  - While *loading=true* --> "scroll" event is ignored!
 * On data OK: (updateFn() fetched some data)
 *  - In this case the container will get some new Nodes and it's size should increase and trigger 2 events:
 *  [MutationObserver]
 *   - This will set *loading=false* and tell the component that it can fetch some new data
 *  [ResizeObserver]
 *   - This will run EVERY time the container's SIZE changes --> window "resize" event can trigger this!
 *   - This will ALSO RUN when component first mounts!
 *   - If *loading=true* event exist immediately
 *   - This event should fire when updateFn() successfully returns new data that is rendered in the scroller's container
 *   - In this case this event will run because the container size changes dues to new nodes increasing the container's size
 *   - A new check is done to see the scroller's bottom position agains the viewport --> *conditionToRefetch()*
 *   - If it is ok, it will trigger updateFn() to get new data --> This will happen when the data from the first updateFn()
 *     doesn't increase the scroller's height beyond the viewport's height --> The user won't be able to scroll on the page -->
 *     --> The "scroll" event won't fire
 *   - Eventually the scroller will be taller than the viewport and it's bottom position will be > window.innerHeight -->
 *     --> User can scroll on the page --> "scroll" event will fire.
 *
 * [DANGER]
 *  - If updateFn() doesn't return new data to be addedd to the scroller's container, state *loading=true* -->
 *    --> The events that call updateFn "scrol" and ResizeObserver will never fire
 *  - I guess in this case all data should be fetched and there is no point in scrolling.
 *  - If the scroller's size doesn't change after new data is fetched, the updateFn() loop won't happen!
 *  - Scroller container should contain nodes made from updateFn()'s data, DON'T ADD OTHER NODES, add them outside the container.
 * 
 *  The issues can be fixed by making sure you fetch enough data on every updateFn()
 *  and that the data inserted actually changes the size (height) of the scroller.
 */
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

const scrollerResizeObserver = new ResizeObserver((entries) => {
    if (state.loading) return; // If data wasn't fetched (No new nodes addedd to the scroller) exit immediately
    for (const entry of entries) {
        if (entry.target && conditionToRefetch()) {
            state.loading = true;
            props.updateFn();
            console.log("Infinite Scroller: updating @resizeObserver");
        }
    }
});

/* Use MutationObserver to check if new nodes are addedd to the scroller
   - This should happen when new data is fetched successfully! */
const scrollerMutationObserver = new MutationObserver(
    () => {
        state.loading = false;
    }
);

onMounted(() => {
    window.addEventListener("scroll", eventLoop);
    if (container.value) {
        // This event automatically fires when scollerComponent mounts!
        scrollerResizeObserver.observe(container.value);
        scrollerMutationObserver.observe(container.value, {
            childList: true,
            attributes: true,
        });
    }
});
onUnmounted(() => {
    window.removeEventListener("scroll", eventLoop);
    scrollerResizeObserver.disconnect();
    scrollerMutationObserver.disconnect();
});
</script>

<template>
    <div
        ref="container"
        :class="containerClass"
    >
        <slot>
        </slot>
    </div>
</template>

<style module lang="scss">
@import "../../styles/ct.scss";
</style>
