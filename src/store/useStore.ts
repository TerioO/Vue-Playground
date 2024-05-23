import { defineStore } from "pinia";
import { reactive, toRaw, isProxy } from "vue";
import { IBaseEntity, IUser } from "../types/types";

export interface EntityShape {
    Users: IUser;
    Posts: IBaseEntity; // To be determined
}
export type EntityKey = keyof EntityShape;
interface IStore {
    entities: {
        [key in EntityKey]?: {
            [id: string]: EntityShape[key];
        }
    }
}

const store = reactive<IStore>({
    entities: {}
});

export const useStore = defineStore("store", () => {
    function addEntries<T extends EntityKey>(entity: T, entries: EntityShape[T][]) {
        const existingEntries = isProxy(store.entities[entity])
            ? toRaw(store.entities[entity])
            : store.entities[entity];
        const newEntries = entries.reduce<{ [id: string]: EntityShape[T] }>((acc, curr) => {
            acc[curr._id] = { ...curr }
            return acc;
        }, {});
        store.entities[entity] = {
            ...existingEntries,
            ...newEntries
        }
    }
    function deleteEntity<T extends EntityKey>(entity: T) {
        delete store.entities[entity];
    }
    function deleteEntry<T extends EntityKey>(entity: T, id: string) {
        if (store.entities[entity]) {
            delete store.entities[entity][id]
        }
    }
    function resetStore(){
        store.entities = { }
    }

    return { 
        store, 
        addEntries, 
        deleteEntity, 
        deleteEntry,
        resetStore
    }
})

