import { EmployeeAuthResult } from "../../entity/employee/entity";

export interface State {
    employeeInfo: EmployeeAuthResult | null;
}

export const state: State = {
    employeeInfo: null
}
