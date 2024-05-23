<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { IUser } from "../types/types";
import Button from "primevue/button";
import dayjs from "dayjs";

const router = useRouter();
const { createdAt } = defineProps<IUser>();
const createdAtDate = computed(() => {
    return dayjs(createdAt).format("DD-MMM-YYYY HH:mm");
});

function handleEditUser(id: string){
    router.push(`/update-user/${id}`);
}
</script>

<template>
    <div :class="$style.userCard">
        <div :class="$style.title">
            <h2>{{ username }}</h2>
            <Button
                @click="handleEditUser(_id)"
                icon="pi pi-file-edit"
                severity="secondary"
                rounded
                raised
                outlined
            />
        </div>
        <div :class="$style.details">
            <p>ROLE</p>
            <p>{{ role }}</p>
            <p>Created at</p>
            <p>{{ createdAtDate }}</p>
        </div>
    </div>
</template>

<style module lang="scss">
@import "../styles/ct.scss";

.userCard {
    @include paper(2);
    border-radius: 0.25rem;
    padding: 1rem;

    .title {
        display: flex;
        align-items: center;
        padding-bottom: 1rem;
        > h2 {
            margin: 0;
        }

        > button {
            margin-left: auto;
        }
    }

    .details {
        display: grid;
        grid-template-columns: auto 1fr;
        row-gap: 0.5rem;
        column-gap: 1rem;

        > p {
            margin: 0;
        }
    }
}
</style>
