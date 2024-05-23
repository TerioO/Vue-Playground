<script setup lang="ts">
import { reactive, computed } from "vue";
import { useStore } from "../store/useStore";
import { useFetchWrapper } from "../hooks/useFetchWrapper";
import { useUserApiStore } from "../store/userApiStore";
import ProgressBar from "primevue/progressbar";
import InfiniteScroller from "../components/Utils/InfiniteScroller.vue";
import UserCard from "../components/UserCard.vue";

const { store } = useStore();
const { getUsers } = useUserApiStore();
const { loading, error, data, trigger } = useFetchWrapper();

const limit = 3;
const pag = reactive({
    page: store.entities.Users
        ? Math.ceil(Object.keys(store.entities.Users).length / limit)
        : 0,
    limit,
});

const Users = computed(() => {
    return store.entities.Users;
});

function getMoreUsers() {
    pag.page += 1;
    trigger(() => getUsers({ page: pag.page, limit: pag.limit }));
}
</script>

<template>
    <div :class="$style.usersList">
        <h1>Users List</h1>
        <InfiniteScroller
            :containerClass="$style.spinner"
            :updateFn="getMoreUsers"
        >
            <UserCard
                v-for="(user, key) in Users"
                :key="key"
                :="user"
            />
        </InfiniteScroller>
        <div :class="$style.spinnerInfo">
            <ProgressBar
                v-if="loading"
                mode="indeterminate"
                style="height: 6px"
            />
            <p v-if="error">{{ error }}</p>
        </div>
    </div>
</template>

<style module lang="scss">
@import "../styles/ct.scss";
.usersList {
    flex: 1;
    > h1 {
        text-align: center;
        margin-top: 0;
    }

    .spinner {
        @include center;
        display: grid;
        grid-template-columns: auto auto auto;
        column-gap: 1rem;
        row-gap: 1rem;
    }

    .spinnerInfo {
        @include center;
        padding: 1.5rem 0;

        > p {
            margin: 0;
            text-align: center;
            color: red;
            font-weight: bold;
        }
    }
}
</style>
