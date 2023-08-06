import { AccessRight } from "../constant/index.js";

export interface Employee {
    empl_id: number;
    ar_id: AccessRight;
    fio: string;
    login: string;
    password: string;
}

export interface EmployeeAuthResult {
    empl_id: number;
    ar_id: AccessRight;
    login: string;
}