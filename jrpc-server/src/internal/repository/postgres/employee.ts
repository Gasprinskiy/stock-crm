import pgPromise from "pg-promise";
import { Employee, EmployeeAuthResult } from '../../entity/employee/entity/index.js';
import { handleRequestError } from "../../../tools/pgerrhandler/index.js";

export interface EmployeeRepoInter {
    CreateEmployee(ts: pgPromise.ITask<{}>, p: Employee): Promise<EmployeeAuthResult | Error>;
    GetEmployeeByLogin(ts: pgPromise.ITask<{}>, login: string) : Promise<Employee | Error>;
}

export class EmployeeRepo implements EmployeeRepoInter {
    public async CreateEmployee(ts: pgPromise.ITask<{}>, p: Employee): Promise<EmployeeAuthResult | Error> {
        const sqlQuery = `
        INSERT INTO employees(ar_id, stock_id, fio, login, password)
        VALUES (${p.ar_id}, ${p.stock_id}, '${p.fio}', '${p.login}', '${p.password}')
        RETURNING ar_id, stock_id, fio`

        return ts.one(sqlQuery)
    }
    public async GetEmployeeByLogin(ts: pgPromise.ITask<{}>, login: string): Promise<Employee | Error> {
        const sqlQuery = `
        SELECT e.ar_id, e.stock_id, e.fio, e.login, e.password
        FROM employees e
        WHERE e.login = $1`

        return handleRequestError(() => {
            return ts.one(sqlQuery, login)
        })
    }
}