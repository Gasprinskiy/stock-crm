import { InjectionKey } from 'vue'
import {
    EmployeeApiWorker,
    EmployeeApiWorkerImpl
} from './core/employee'

type Injection = {[key: string]: {key: InjectionKey<any>, implementation: object}}

export const InjectionKeysMap: Injection = {
    employee: {
        key: Symbol() as InjectionKey<EmployeeApiWorker>,
        implementation: new EmployeeApiWorkerImpl()
    },
}

export default InjectionKeysMap