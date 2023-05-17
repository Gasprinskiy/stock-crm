import pgPromise from "pg-promise";
import { Employee, EmployeeAuthResult } from "../../entity/employee/entity/index.js";
import { AccesRight } from "../../entity/employee/constant/index.js";
import { handleRequestError } from "../../../tools/errhandler/pg/index.js";

export interface EmployeeRepoInter {
    createEmployee(ts: pgPromise.ITask<{}>, p: Employee): Promise<EmployeeAuthResult | Error>;
    getEmployeeByLogin(ts: pgPromise.ITask<{}>, login: string) : Promise<Employee | Error>;
}

export class EmployeeRepo implements EmployeeRepoInter {
    async createEmployee(ts: pgPromise.ITask<{}>, p: Employee): Promise<EmployeeAuthResult | Error> {
        return {
            ar_id: AccesRight.seller,
            stock_id: 0,
            fio: "",
        }
    }
    async getEmployeeByLogin(ts: pgPromise.ITask<{}>, login: string): Promise<Employee | Error> {
        const sqlQuery = `
        SELECT e.ar_id, e.stock_id, e.fio, e.login, e.password
        FROM employees e
        WHERE e.login = $1`

        return handleRequestError(() => {
            return ts.one(sqlQuery, login)
        })
    }
}