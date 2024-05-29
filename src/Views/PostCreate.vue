<script setup lang="ts">
import { reactive } from "vue";
import { ICreatePostReq } from "../store/usePostApiStore";
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";
import Textarea from "primevue/textarea";
import Button from "primevue/button";

const form = reactive({
    title: "",
    body: "",
});

function handleCreatePost() {}
</script>

<template>
    <div :class="$style.postCreate">
        <h1>Create New Post</h1>
        <form @submit.prevent="handleCreatePost">
            <FloatLabel :class="$style.floatLabel">
                <label for="title">Title</label>
                <InputText
                    :class="$style.title"
                    id="title"
                    v-model="form.title"
                />
            </FloatLabel>
            <FloatLabel :class="$style.floatLabel">
                <label for="body">Post Body</label>
                <Textarea
                    :class="$style.textarea"
                    id="body"
                    v-model="form.body"
                    placeholder="Write something for you blog..."
                />
            </FloatLabel>
            <Button
                :class="$style.submitBtn"
                type="submit"
                text
                raised
                >Create Post</Button
            >
        </form>
    </div>
</template>

<style module lang="scss">
@import "../styles/ct.scss";

.postCreate {
    @include center;
    flex: 1;
    > h1 {
        margin-top: 0;
        margin-bottom: 2rem;
        text-align: center;
    }

    > form {
        display: flex;
        @include paper(4);
        @include center;
        max-width: 600px;
        flex-direction: column;
        padding: 1rem;
        align-items: center;

        .floatLabel {
            margin: 1rem 0;
            @media (width <= $br-phone) {
                width: 100%;
            }

            .title {
                @media (width <= $br-phone) {
                    width: 100%;
                }
            }

            .textarea {
                max-width: calc(600px - 2rem);
                min-width: 400px;
                min-height: 200px;
                max-height: 600px;

                @media (width <= $br-phone) {
                    min-width: 100%;
                }
            }
        }

        .submitBtn {
            width: fit-content;
            margin: 4rem 0 0 0;
        }
    }
}
</style>
