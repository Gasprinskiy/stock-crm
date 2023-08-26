import { DexieDb } from "./dexie/";
import { InjectionKey } from "vue"
import { CartStorage, CartStorageImpl } from "@/storage_worker/core/cart";

const db = new DexieDb()

type InjectionKeys = {[key: string]: InjectionKey<any>}
type InjectionImpl = {[key: string]: object}

export const CartStorageInjectionKey = Symbol() as InjectionKey<CartStorage>

const InjectionKeysMap: InjectionKeys = {
    cart: CartStorageInjectionKey,
}

const InjectionImplMap : InjectionImpl = {
    cart: new CartStorageImpl(db)
}

export default {
    injection_keys: InjectionKeysMap,
    injection_impl: InjectionImplMap
}