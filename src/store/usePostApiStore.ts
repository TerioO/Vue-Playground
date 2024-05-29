import { defineStore } from "pinia";
import { useApiStore } from "./apiStore";
import { IPost, IPagination } from "../types/types";

export interface ICreatePostReq extends Omit<IPost, "userId" | "author"> { }
export interface IGetPostByIdParam { postId: string; }
export interface IGetPostsQuery extends IPagination { }
export interface IUpdateMyPostReq extends Omit<IPost, "userId" | "author"> { postId: string; }
export interface IDeleteMyPostReq { postId: string }

interface IBaseRes { message: string }
export interface ICreatePostRes extends IBaseRes { post: IPost }
export interface IGetPostByIdRes extends IBaseRes  { post: IPost }
export interface IGetPostsRes extends IBaseRes { posts: IPost[], count: number }
export interface IGetMyPostsRes extends IBaseRes { posts: IPost[], count: number }
export interface IUpdateMyPostRes extends IBaseRes { updatedPost: IPost }
export interface IDeleteMyPostRes extends IBaseRes { }

export const usePostApiStore = defineStore("post", () => {
    const { baseQueryWithAuth } = useApiStore();

    async function createPost(payload: ICreatePostReq){
        const res = await baseQueryWithAuth<ICreatePostRes>("/post/create", {
            method: "POST",
            data: payload
        })
        return res;
    }
    async function getPostById({ postId }: IGetPostByIdParam){
        const res = await baseQueryWithAuth<IGetPostByIdRes>(`/post/single/${postId}`)
        return res;
    }
    async function getPosts({ page, limit }: IGetPostsQuery){
        const res = await baseQueryWithAuth<IGetPostsRes>(`/posts?page=${page}&limit=${limit}`)
        return res;
    }
    async function getMyPosts({ page, limit }: IGetPostsQuery){
        const res = await baseQueryWithAuth<IGetMyPostsRes>(`/post/my-posts?page=${page}&limit=${limit}`)
        return res;
    }
    async function updateMyPost(payload: IUpdateMyPostReq){
        const res = await baseQueryWithAuth<IUpdateMyPostRes>("/post/update", {
            method: "PATCH",
            data: payload
        })
        return res;
    }
    async function deleteMyPost(payload: IDeleteMyPostReq){
        const res = await baseQueryWithAuth<IDeleteMyPostRes>("/post/delete", {
            method: "DELETE",
            data: payload
        })
        return res;
    }

    return {
        createPost,
        getPostById,
        getPosts,
        getMyPosts,
        updateMyPost,
        deleteMyPost
    }
})