import { AccessRight } from "../constant/index.js";

export interface Employee {
    empl_id: number;
    ar_id: AccessRight;
    stock_id: number;
    fio: string;
    login: string;
    password: string;
}

export interface EmployeeAuthResult {
    empl_id: number;
    ar_id: AccessRight;
    login: string;
    fio: string;
}