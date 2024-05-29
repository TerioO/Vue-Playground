<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { useAuthStore } from "../store/authStore";
import { useFetchWrapper } from "../hooks/useFetchWrapper";
import {
    useUserApiStore,
    IResGetUserById,
    IPayloadUpdateUsersAccount,
    IResUpdateUsersAccount,
} from "../store/userApiStore";
import { Roles } from "../types/types";
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import ModalUtil from "../components/Utils/ModalUtil.vue";
import UsernameInput from "../components/Utils/UsernameInput.vue";
import PasswordInput from "../components/Utils/PasswordInput.vue";
import ProgressSpinner from "primevue/progressspinner";
import Button from "primevue/button";
import SelectButton from "primevue/selectbutton";

// Refs/State:
const { auth } = useAuthStore();
const route = useRoute();
const toast = useToast();
const { getUserById, updateUsersAccount } = useUserApiStore();
const { loading, error, data, trigger } = useFetchWrapper<IResGetUserById>();
const {
    loading: l2,
    error: e2,
    data: d2,
    trigger: t2,
} = useFetchWrapper<IResUpdateUsersAccount>();

const modal = ref<boolean>(false);
const form = reactive<IPayloadUpdateUsersAccount>({
    _id: "",
    username: "",
    password: "",
    role: undefined,
});
const roleOptions = ref<Roles[]>(["USER", "ADMIN"]);

// Computed:
const user = computed(() => {
    if (d2.value?.ok) return d2.value?.data.updatedUser;
    else return data.value?.data.user;
});

// Handlers:
function openModal() {
    modal.value = true;
}

function closeModal(value: boolean) {
    modal.value = value;
}

async function handleUpdateAccount() {
    await t2(() => updateUsersAccount(form));
    if (d2.value?.ok)
        toast.add({
            severity: "success",
            summary: "Account Updated!",
            detail: "Click username to view the updates",
            life: 2000,
        });
}

// Lifecycle:
onMounted(async () => {
    await trigger(() => getUserById({ id: route.params.id as string }));
    if (data.value?.ok) {
        form._id = data.value.data.user._id;
        form.username = data.value.data.user.username;
        if(auth.userInfo.role === "OWNER") form.role = data.value.data.user.role;
    }
});
</script>

<template>
    <ModalUtil
        :open="modal"
        @onClose="closeModal"
        :containerClass="$style.modal"
    >
        <h2>Initial User Entry</h2>
        <p>
            This is what the user's entry looked like when this page was opened
        </p>
        <pre>{{ data?.data.user }}</pre>
        <h2>Updated User Entry</h2>
        <p>
            This is what the user's entry looks like after the most recent
            successfull update
        </p>
        <pre>{{ d2?.data.updatedUser }}</pre>
    </ModalUtil>
    <h1
        v-if="data?.ok"
        v-tooltip="'Click to open JSON response'"
        :class="$style.link"
        @click="openModal"
    >
        {{ user?.username }}
    </h1>
    <h1 v-else>Single User</h1>
    <div :class="[$style.singleUser, loading ? $style.loading : '']">
        <ProgressSpinner v-if="loading" />
        <p
            v-if="error"
            :class="$style.error"
        >
            {{ error }}
        </p>
        <form
            v-if="data?.ok"
            @submit.prevent="handleUpdateAccount"
        >
            <h2>Update Profile</h2>
            <UsernameInput
                v-model="form.username"
                :containerProps="{ marginTB: 'large' }"
            />
            <PasswordInput
                LABEL="New Password"
                v-model="form.password"
                :containerProps="{ marginTB: 'large' }"
            />
            <SelectButton
                v-if="auth.userInfo.role === 'OWNER'"
                v-model="form.role"
                :options="roleOptions"
                :class="$style.selectButton"
            />
            <p
                v-if="e2"
                :class="$style.e2"
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

h1 {
    text-align: center;
    margin-top: 0;
    @media (width <= $br-phone) {
        margin-top: 0;
    }
}

h1.link {
    text-decoration: underline;
    cursor: pointer;
    user-select: none;
}

.singleUser {
    @include center;

    > form {
        .selectButton {
            margin: 2rem 0;
        }
        .submitBtn {
            width: 180px;
            display: flex;
            justify-content: center
        }
    }
}

.modal {
    overflow-y: auto;

    > h2 {
        margin: 1rem 0 0 0;
        & + p {
            font-size: 0.9rem;
            margin: 0.25rem 0 1rem 0;
        }
    }

    h2 ~ h2 {
        margin-top: 2.5rem;
    }
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
}

.e2 {
    color: red;
    margin: 2rem 0 0.5rem 0;
}

.error {
    color: red;
    font-size: 1.1rem;
    text-align: center;
    font-weight: bold;
}
</style>
