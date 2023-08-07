import { InjectionKey } from 'vue'
import { EmployeeAuthResult } from "../../entity/employee/entity";
import { AuthParams } from "../../entity/employee/params";
import { handleApiPostRequest, handleApiGetRequest } from "../axios";

export const injectionKey = Symbol() as InjectionKey<EmployeeApiWorker>

export interface EmployeeApiWorker {
    logIn(params: AuthParams): Promise<EmployeeAuthResult>;
    logOut() : Promise<void>;
    getEmployeeInfo(): Promise<EmployeeAuthResult>;
}

export class EmployeeApiWorkerImpl implements EmployeeApiWorker {
    logIn(params: AuthParams): Promise<EmployeeAuthResult> {
        return handleApiPostRequest('log_in', params)
    }

    logOut(): Promise<void> {
        return handleApiPostRequest("log_out")
    }

    getEmployeeInfo(): Promise<EmployeeAuthResult> {
        return handleApiGetRequest('employee_info')
    }

}