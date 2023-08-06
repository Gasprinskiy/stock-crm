import { createStore } from "vuex";
import { state } from "./state";
import { getters } from "./getters";
import { mutations } from "./mutation";

const store = createStore({
    state: state,
    getters: getters,
    mutations: mutations
})

export default store