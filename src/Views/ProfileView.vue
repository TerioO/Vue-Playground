<script setup lang="ts">
import { computed, onMounted, reactive } from "vue";
import {
    useUserApiStore,
    IResProfile,
    IPayloadUpdateMyAccount,
    IResUpdateMyAccount,
} from "../store/userApiStore";
import { IResLogin, useAuthApiStore } from "../store/authApiStore";
import { useFetchWrapper } from "../hooks/useFetchWrapper";
import { useToast } from "primevue/usetoast";
import dayjs from "dayjs";
import UsernameInput from "../components/Utils/UsernameInput.vue";
import PasswordInput from "../components/Utils/PasswordInput.vue";
import ProgressSpinner from "primevue/progressspinner";
import Button from "primevue/button";

const toast = useToast();
const { refresh } = useAuthApiStore();
const { getProfile, updateMyAccount } = useUserApiStore();
const { loading, error, data, trigger } = useFetchWrapper<IResProfile>();
const {
    loading: l2,
    error: e2,
    data: d2,
    trigger: triggerUpdate,
} = useFetchWrapper<IResUpdateMyAccount>();
const { trigger: triggerRefresh } = useFetchWrapper<IResLogin>();

const form = reactive<IPayloadUpdateMyAccount>({
    username: "",
    oldPassword: "",
    newPassword: "",
});

// Computed:
const profile = computed(() => {
    return data.value?.data.profile;
});

// Handlers:
async function updateAccount() {
    await triggerUpdate(() => updateMyAccount(form));
    if (d2.value?.ok) {
        toast.add({
            severity: "success",
            summary: "Account Updated!",
            detail: "Your changes went through",
            life: 3000,
        });
        triggerRefresh(refresh);
        trigger(getProfile);
    }
}

// Lifecycle:
onMounted(async () => {
    await trigger(getProfile);
    if (data.value?.ok) {
        form.username = data.value.data.profile.username;
    }
});
</script>

<template>
    <div :class="$style.profile">
        <h1>Profile</h1>
        <div :class="[$style.info, loading ? $style.loading : '']">
            <ProgressSpinner
                v-if="loading"
                style="width: 2rem; height: 2rem; color: greenyellow"
                strokeWidth="8"
            />
            <p
                v-if="error"
                :class="$style.error"
            >
                {{ error }}
            </p>
            <template v-if="profile">
                <p>Username</p>
                <p>{{ profile?.username }}</p>
                <p>Role</p>
                <p>{{ profile?.role }}</p>
                <p>Created At</p>
                <p>
                    {{ dayjs(profile?.createdAt).format("DD-MMM-YYYY HH:mm") }}
                </p>
                <p>Updated At</p>
                <p>
                    {{ dayjs(profile?.updatedAt).format("DD-MMM-YYYY HH:mm") }}
                </p>
            </template>
        </div>
        <form @submit.prevent="updateAccount">
            <h2>Update Profile</h2>
            <UsernameInput
                v-model="form.username"
                :containerProps="{ marginTB: 'large' }"
            />
            <PasswordInput
                LABEL="Current Password"
                v-model="form.oldPassword"
                :containerProps="{ marginTB: 'large' }"
            />
            <PasswordInput
                LABEL="New Password"
                v-model="form.newPassword"
                :containerProps="{ marginTB: 'large' }"
            />
            <p
                v-if="e2"
                :class="$style.error"
            >
                {{ e2 }}
            </p>
            <Button
                type="submit"
                :disabled="l2"
                :class="$style.submitBtn"
            >
                {{ l2 ? "LOADING" : "Update Account" }}
            </Button>
        </form>
    </div>
</template>

<style module lang="scss">
@import "../styles/ct.scss";
.profile {
    @include center;

    > h1 {
        text-align: center;
        @media (width <= $br-phone) {
            margin-top: 0;
        }
    }

    div.info {
        @include paper(2);
        border-radius: 0.25rem;
        padding: 1rem;
        margin: 2rem 0 4rem 0;
        display: grid;
        grid-template-columns: auto 1fr;
        column-gap: 1rem;
        row-gap: 0.5rem;
        overflow: hidden;

        .error {
            color: red;
            font-size: 1.1rem;
            font-weight: bold;
        }

        > p {
            margin: 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }

    .info.loading {
        grid-template-columns: auto;
        align-items: center;
    }

    > form {
        > h2 {
            margin: 2rem 0 3rem 0;
        }

        .error {
            color: red;
            margin: 0 0 0.25rem 0;
        }

        .submitBtn {
            width: 200px;
            display: flex;
            justify-content: center;
        }
    }
}
</style>
