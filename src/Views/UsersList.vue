<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useStore } from '../store/useStore';
import { useFetchWrapper } from '../hooks/useFetchWrapper';
import { useUserApiStore } from '../store/userApiStore';
import InfiniteScroller from '../components/Utils/InfiniteScroller.vue';
import UserCard from '../components/UserCard.vue';

const { store } = useStore();
const { getUsers } = useUserApiStore();
const { loading, error, data, trigger } = useFetchWrapper();

const pag = reactive({
    page: 0,
    limit: 2
})

const Users = computed(() => {
    return store.entities.Users
})

function getMoreUsers(){
    pag.page += 1;
    trigger(() => getUsers({ page: pag.page, limit: pag.limit }));
}
</script>

<template>
    <div :class="$style.usersList" >
        <h1>Users List</h1>
        <InfiniteScroller :updateFn="getMoreUsers">
            <UserCard 
                v-for="(user, key) in Users"
                :key="key"
                :="user"
            />
        </InfiniteScroller>
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

    > h2 {
        font-size: 4rem;
        margin: 3rem 0;
    }
}
</style>
