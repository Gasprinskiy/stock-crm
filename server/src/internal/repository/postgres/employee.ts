import pg from "pg";
import { Employee, EmployeeAuthResult } from '../../entity/employee/entity/index.js';
import { get, insert } from "../../../tools/repository-generic/index.js";

export interface EmployeeRepoInter {
    CreateEmployee(ts: pg.PoolClient, p: Employee): Promise<EmployeeAuthResult>;
    GetEmployeeByLogin(ts: pg.PoolClient, login: string) : Promise<Employee>;
}

export class EmployeeRepo implements EmployeeRepoInter {
    public CreateEmployee(ts: pg.PoolClient, p: Employee): Promise<EmployeeAuthResult> {
        const sqlQuery = `
        INSERT INTO employees(ar_id, fio, login, password)
        VALUES (${p.ar_id}, '${p.fio}', '${p.login}', '${p.password}')
        RETURNING empl_id, ar_id, login`

        return insert(ts, sqlQuery, true)
    }

    public GetEmployeeByLogin(ts: pg.PoolClient, login: string): Promise<Employee> {
        const sqlQuery = `
        SELECT e.empl_id, e.ar_id, e.fio, e.login, e.password
        FROM employees e
        WHERE e.login = $1
        ADNE e.deleted = false`

        return get(ts, sqlQuery, [login])
    }
}