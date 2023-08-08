import { defineStore } from 'pinia'
import { EmployeeAuthResult } from '../entity/employee/entity';
import { AccessRight } from '../entity/employee/constant';

interface State {
    employeeInfo: EmployeeAuthResult | null;
}

export const useUserStore = defineStore("user", {
    state: () : State => {
        return {
            employeeInfo: null
        }
    },

    actions: {
        set_employee_info(payload: EmployeeAuthResult | null) : void {
            this.employeeInfo = payload
        },

        check_acces_right(...ar_id_list: AccessRight[]) : boolean {
            if (this.employeeInfo) {
                return this.employeeInfo.ar_id === AccessRight.full_access || ar_id_list.includes(this.employeeInfo.ar_id)
            }
            return false
        }
    },
})
