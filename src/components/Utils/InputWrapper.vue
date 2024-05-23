<script setup lang="ts">
import { computed } from "vue";
import { CSSProperties } from "vue";
// Props:
export interface Props {
    marginTB?: "small" | "medium" | "large" | number;
    padding?: CSSProperties["padding"];
    fullWidth?: boolean;
    width?: CSSProperties["width"];
}
const { marginTB, padding } = withDefaults(defineProps<Props>(), {
    marginTB: "small",
    padding: "0",
    fullWidth: false,
    width: "initial",
});

// Computed:
const mg = computed(() => {
    if (marginTB === "small") return "16px";
    else if (marginTB === "medium") return "24px";
    else if (marginTB === "large") return "34px";
    else if (typeof marginTB === "number") return `${marginTB}px`;
    return "16px";
});
</script>

<template>
    <span
        :class="[$style.wrapper, fullWidth ? $style.fullWidth : '']"
        :style="{ width }"
    >
        <slot>InputWrapper.vue expects a slot</slot>
    </span>
</template>

<!-- HMR Doesn't work with v-bind and CSS, it will apply the changes on page refresh! -->
<!-- HMR Will work with class changes though, see fullWidth ? $style.fullWidth : '' -->
<style module lang="scss">
.wrapper {
    display: flex;
    margin: v-bind(mg) 0;
    padding: v-bind(padding);
}

.fullWidth {
    > span {
        display: flex;
        width: 100%;
        
        input {
            width: 100%;
        }
    }
}
</style>
