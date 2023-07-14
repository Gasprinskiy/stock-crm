import { AccessRight } from "../constant/index.js";

export interface Employee {
    ar_id: AccessRight;
    stock_id: number;
    fio: string;
    login: string;
    password: string;
}

export interface EmployeeAuthResult {
    ar_id: AccessRight;
    stock_id: number;
    fio: string;
    login: string;
}

