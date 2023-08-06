import { MutationTree } from "vuex/types/index.js";
import { State } from "../state";
import { EmployeeAuthResult } from "../../entity/employee/entity";
import types from "./types";

export const mutations: MutationTree<State> = {
    [types.SET_EMPLOYEE_INFO](state: State, payload: EmployeeAuthResult) {
        state.employeeInfo = payload
    }
}