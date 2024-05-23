<script setup lang="ts">
import Password, { PasswordProps } from "primevue/password";
import FloatLabel from "primevue/floatlabel";
import InputWrapper, { Props as InputWrapperProps } from "./InputWrapper.vue";

// Props:
interface Props {
    LABEL?: string;
    passwordProps?: PasswordProps;
    containerProps?: InputWrapperProps;
}
withDefaults(defineProps<Props>(), {
    LABEL: "Password"
});
const model = defineModel<string>({
    required: true
});
</script>

<template>
    <InputWrapper :=containerProps>
        <FloatLabel>
            <Password
                :id="$style.pass"
                v-model="model"
                :toggleMask="true"
                :feedback="false"
                :=passwordProps
            />
            <label :for="$style.pass">{{ LABEL }}</label>
        </FloatLabel>
    </InputWrapper>
</template>

<style module lang="scss">
#pass {
    color: inherit;
    width: 100%;
}
</style>
