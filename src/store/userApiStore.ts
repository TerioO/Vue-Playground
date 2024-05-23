import { defineStore } from "pinia";
import { useApiStore } from "./apiStore";
import { IUser, Roles } from "../types/types";
import { useDelay } from "../hooks/useDelay";
import { IPagination } from "../types/types";
import { useStore } from "./useStore";

export interface IResProfile { profile: IUser }
export interface IResUsersList {
    users: IUser[];
    count: number;
}
export interface IResGetUserById { user: IUser }
export interface IPayloadGetUserById { id: string }
export interface IResUpdateMyAccount { updatedUser: IUser; }
export interface IPayloadUpdateMyAccount {
    username?: string;
    newPassword?: string;
    oldPassword?: string;
}
export interface IPayloadUpdateUsersAccount {
    _id: string;
    username?: string;
    password?: string;
    role?: Roles
}
export interface IResUpdateUsersAccount { updatedUser: IUser }
export const useUserApiStore = defineStore("user-api", () => {
    const { baseQueryWithAuth } = useApiStore();
    const { addEntries } = useStore();

    async function getProfile() {
        await useDelay(1);
        const res = await baseQueryWithAuth<IResProfile>("/users/profile");
        return res;
    }
    async function getUsers({ limit, page }: IPagination) {
        await useDelay(1);
        const res = await baseQueryWithAuth<IResUsersList>(`/users/list?page=${page}&limit=${limit}`);
        addEntries("Users", res.data.users);
        return res;
    }
    async function getUserById({ id }: IPayloadGetUserById) {
        const res = await baseQueryWithAuth<IResGetUserById>(`/users/single-user/${id}`);
        return res;
    }
    async function updateMyAccount(payload: IPayloadUpdateMyAccount) {
        await useDelay(1);
        const res = await baseQueryWithAuth<IResUpdateMyAccount>("/users/update", {
            method: "PATCH",
            data: payload
        });
        return res;
    }
    async function updateUsersAccount(payload: IPayloadUpdateUsersAccount) {
        const res = await baseQueryWithAuth<IResUpdateUsersAccount>("/users/update-user", {
            method: "PATCH",
            data: payload
        });
        return res;
    }

    return {
        getProfile,
        getUsers,
        getUserById,
        updateMyAccount,
        updateUsersAccount
    }
})