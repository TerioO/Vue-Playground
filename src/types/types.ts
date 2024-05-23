import { ROLES } from "./constants";

export type Roles = typeof ROLES[keyof typeof ROLES];
export interface IAccessToken {
    userInfo: {
        id: string;
        username: string;
        role: Roles | undefined;
    }
}
export interface IBaseEntity {
    _id: string;
    __v: number;
}
export interface IUser extends IBaseEntity {
    username: string;
    password: string;
    role: Roles;
    createdAt: string;
    updatedAt: string;
}
export interface IPagination {
    page?: number | undefined;
    limit?: number | undefined;
}