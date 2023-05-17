import { AccesRight } from "../constant/index.js";

export interface Employee {
    ar_id: AccesRight;
    stock_id: number;
    fio: string;
    login: string;
    password: string;
}

export interface EmployeeAuthResult {
    ar_id: AccesRight;
    stock_id: number;
    fio: string;
}

