import { InjectionKey } from 'vue'
import { EmployeeAuthResult } from "../../entity/employee/entity";
import { AuthParams } from "../../entity/employee/params";
import { handleApiPostRequest, handleApiGetRequest } from "../helpers";

export const injectionKey = Symbol() as InjectionKey<EmployeeApiWorker>

export interface EmployeeApiWorker {
    auth(params: AuthParams): Promise<EmployeeAuthResult>;
}

export class EmployeeApiWorkerImpl implements EmployeeApiWorker {
    auth(params: AuthParams): Promise<EmployeeAuthResult> {
        return handleApiPostRequest('auth', params)
    }

    isAuth(): Promise<void> {
        return handleApiGetRequest('is_auth')
    }

}