<script setup lang="ts">
import { reactive, computed } from "vue";
import { useStore } from "../store/useStore";
import { useFetchWrapper } from "../hooks/useFetchWrapper";
import { useUserApiStore } from "../store/userApiStore";
import ProgressBar from "primevue/progressbar";
import InfiniteScrollerV2 from "../components/Utils/InfiniteScrollerV2.vue";
import UserCard from "../components/UserCard.vue";

const { store } = useStore();
const { getUsers } = useUserApiStore();
const { loading, error, trigger } = useFetchWrapper();

const limit = 3;
const state = reactive({
    page: store.entities.Users
        ? Math.ceil(Object.keys(store.entities.Users).length / limit)
        : 0,
    limit,
});

const Users = computed(() => {
    return store.entities.Users;
});

function getMoreUsers() {
    state.page += 1;
    trigger(() => getUsers({ page: state.page, limit: state.limit }));
}
</script>

<template>
    <div :class="$style.usersList">
        <h1>Users List</h1>
        <InfiniteScrollerV2 
            :class="$style.scroller"
            :threshold=".5"
            :updateFn="getMoreUsers">
            <UserCard
                v-for="(user, key) in Users"
                :key="key"
                :user="user"
                :containerClass="$style.userCard"
            />
        </InfiniteScrollerV2>
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

    .userCard {
        min-width: 300px;
    }

    .scroller {
        @include center;
        display: grid;
        grid-template-columns: auto auto auto;
        column-gap: 1rem;
        row-gap: 1rem;
        @media (width <= $br-PC) {
            grid-template-columns: auto auto;
        }
        @media (width <= $br-tablet) {
            grid-template-columns: auto;
        }
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
