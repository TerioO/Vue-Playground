<script setup lang="ts">
import { reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthApiStore, IResLogin } from "../store/authApiStore";
import { useFetchWrapper } from "../hooks/useFetchWrapper";
import { useAuthStore } from "../store/authStore";
import Button from "primevue/button";
import ProgressBar from "primevue/progressbar";
import UsernameInput from "../components/Utils/UsernameInput.vue";
import PasswordInput from "../components/Utils/PasswordInput.vue";
import Checkbox from "primevue/checkbox";

// Refs/State:
const router = useRouter();
const { auth, toggleRememberMe } = useAuthStore();
interface Form {
    username: string;
    password: string;
    rememberMe: boolean;
}
const form = reactive<Form>({ username: "", password: "", rememberMe: false });
const { login } = useAuthApiStore();
const { loading, error, data, trigger } = useFetchWrapper<IResLogin>();

// Computed:
const btnDisabled = computed(() => {
    return loading.value
        ? loading.value
        : !Boolean(form.username && form.password);
});

// Handlers:
function handleLogin(_e: Event) {
    trigger(() =>
        login({ username: form.username, password: form.password })
    );
}

// Watchers:
watch(data, () => {
    if (data.value?.ok) router.push("/");
});
</script>

<template>
    <div :class="$style.login">
        <form @submit.prevent="handleLogin">
            <h1>Login</h1>
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
            <div :class="$style.checkbox">
                <Checkbox
                    :value="auth.rememberMe"
                    :modelValue="auth.rememberMe"
                    @update:modelValue="toggleRememberMe"
                    :binary="true"
                    inputId="check"
                />
                <label for="check">Remember me?</label>
            </div>
            <p :class="$style.rememberMeInfo">If you don't check this, login session is lost on every page refresh or new window.</p>
            <p :class="$style.registerLink">
                Not Registered?
                <RouterLink to="/register">Create an account</RouterLink>
            </p>
            <p
                v-if="error"
                :class="$style.error"
            >
                {{ error }}
            </p>
            <Button
                :class="$style.btnSubmit"
                type="submit"
                :disabled="btnDisabled"
            >
                Login
            </Button>
            <ProgressBar
                v-if="loading"
                :class="$style.progress"
                mode="indeterminate"
            />
        </form>
    </div>
</template>

<style module lang="scss">
@import "../styles/ct.scss";
.login {
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

        > p.registerLink {
            margin: 2rem 0 1rem 0;
            text-align: center;
        }

        p.rememberMeInfo {
            font-size: 0.8rem;
            margin: .25rem 0 0 0;
        }

        > p.error {
            color: red;
            text-align: center;
        }

        > div.checkbox {
            display: flex;
            margin: 0.35rem 0;

            > label {
                margin-left: 6px;
            }
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
