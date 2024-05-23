<script setup lang="ts">
import { reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useFetchWrapper } from "../hooks/useFetchWrapper";
import { useAuthApiStore, IResMessage, IResLogin } from "../store/authApiStore";
import Button from "primevue/button";
import UsernameInput from "../components/Utils/UsernameInput.vue";
import PasswordInput from "../components/Utils/PasswordInput.vue";
import ProgressBar from "primevue/progressbar";

// Refs/state:
const router = useRouter();
const form = reactive({
    username: "",
    password: "",
});
const { login, register } = useAuthApiStore();
const { loading, error, data, trigger } = useFetchWrapper<IResMessage>();
const {
    loading: loadingLogin,
    error: errorLogin,
    data: dataLogin,
    trigger: triggerLogin,
} = useFetchWrapper<IResLogin>();

// Computed:
const btnDisabled = computed(() => {
    return (loading.value || loadingLogin.value)
        ? (loading.value || loadingLogin.value)
        : !Boolean(form.username && form.password);
});

// Handlers:
function handleRegister() {
    trigger(() =>
        register({ username: form.username, password: form.password })
    );
}

// Watchers:
watch(data, () => {
    if (data.value?.ok) {
        console.log("Logging in")
        triggerLogin(() => login({ username: form.username, password: form.password }));
    }
});

watch(dataLogin, () => {
    if(dataLogin.value?.ok) {
        router.push("/")
    }
})
</script>

<template>
    <div :class="$style.register">
        <form @submit.prevent="handleRegister">
            <h1>Register</h1>
            <UsernameInput
                LABEL="Username*"
                v-model="form.username"
                :containerProps="{ fullWidth: true }"
            />
            <PasswordInput
                LABEL="Password*"
                v-model="form.password"
                :containerProps="{ fullWidth: true }"
            />
            <p
                v-if="error"
                :class="$style.error"
            >
                {{ error }}
            </p>
            <p
                v-if="errorLogin"
                :class="$style.error"
            >
                {{ errorLogin }}
            </p>
            <p :class="$style.loginLink">
                Already own an account?
                <RouterLink to="/login">Login here</RouterLink>
            </p>
            <Button
                :class="$style.btnSubmit"
                type="submit"
                :disabled="btnDisabled"
            >
                Register
            </Button>
            <ProgressBar
                v-if="loading || loadingLogin"
                :class="$style.progress"
                mode="indeterminate"
            />
        </form>
    </div>
</template>

<style module lang="scss">
@import "../styles/ct.scss";
.register {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    > form {
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        @include paper(4);
        border-radius: 0.35rem;
        padding: 1rem 2rem;
        width: 400px;

        > h1 {
            text-align: center;
        }

        > p.loginLink {
            margin: 2rem 0 1rem 0;
            text-align: center;
        }

        > p.error {
            color: red;
            text-align: center;
        }

        .btnSubmit {
            width: fit-content;
            align-self: center;
            margin: 1rem 0;
        }
    }

    .progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 6px;
        width: 100%;
        border-radius: 0;
    }
}
</style>
