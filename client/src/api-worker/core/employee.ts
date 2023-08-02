import { InjectionKey } from 'vue'
import { EmployeeAuthResult } from "../../entity/employee/entity";
import { AuthParams } from "../../entity/employee/params";
import { handleApiPostRequest, handleApiGetRequest } from "../helpers";

export const injectionKey = Symbol() as InjectionKey<EmployeeApiWorker>

export interface EmployeeApiWorker {
    logIn(params: AuthParams): Promise<EmployeeAuthResult>;
    logOut() : Promise<void>;
    isAuth(): Promise<void>;
}

export class EmployeeApiWorkerImpl implements EmployeeApiWorker {
    logIn(params: AuthParams): Promise<EmployeeAuthResult> {
        return handleApiPostRequest('log_in', params)
    }

    logOut(): Promise<void> {
        return handleApiPostRequest("log_out")
    }

    isAuth(): Promise<void> {
        return handleApiGetRequest('is_auth')
    }

}