import { AccessRight } from "../constant";

export interface EmployeeAuthResult {
    empl_id: number;
    ar_id: AccessRight;
    login: string;
}