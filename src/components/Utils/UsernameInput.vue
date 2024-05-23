<script setup lang="ts">
import FloatLabel from "primevue/floatlabel";
import InputText, { InputTextProps } from "primevue/inputtext";
import InputWrapper, { Props as InputWrapperProps } from "./InputWrapper.vue";

// Props:
interface Props {
    LABEL?: string;
    inputTextProps?: InputTextProps;
    containerProps?: InputWrapperProps;
}
withDefaults(defineProps<Props>(), {
    LABEL: "Username",
});
const model = defineModel<string>({
    required: true
});
</script>

<template>
    <InputWrapper :="containerProps">
        <FloatLabel>
            <InputText
                :id="$style.username"
                v-model="model"
                :="inputTextProps"
            />
            <label :for="$style.username">{{ LABEL }}</label>
        </FloatLabel>
    </InputWrapper>
</template>

<style module lang="scss">
#username {
    color: inherit;
    width: 100%;
}
</style>
