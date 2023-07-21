import pgPromise from "pg-promise";
import { Employee, EmployeeAuthResult } from '../../entity/employee/entity/index.js';
import { selectOne } from "../../../tools/pg-err-handler/index.js";

export interface EmployeeRepoInter {
    CreateEmployee(ts: pgPromise.ITask<object>, p: Employee): Promise<EmployeeAuthResult>;
    GetEmployeeByLogin(ts: pgPromise.ITask<object>, login: string) : Promise<Employee>;
}

export class EmployeeRepo implements EmployeeRepoInter {
    public async CreateEmployee(ts: pgPromise.ITask<object>, p: Employee): Promise<EmployeeAuthResult> {
        const sqlQuery = `
        INSERT INTO employees(ar_id, stock_id, fio, login, password)
        VALUES (${p.ar_id}, ${p.stock_id}, '${p.fio}', '${p.login}', '${p.password}')
        RETURNING empl_id, ar_id, login`

        return ts.one(sqlQuery)
    }
    public async GetEmployeeByLogin(ts: pgPromise.ITask<object>, login: string): Promise<Employee> {
        const sqlQuery = `
        SELECT e.empl_id, e.ar_id, e.fio, e.login, e.password
        FROM employees e
        WHERE e.login = $1`

        return selectOne(ts, sqlQuery, login)
    }
}