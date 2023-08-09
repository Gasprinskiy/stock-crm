import pg from "pg";
import { Employee, EmployeeAuthResult } from '../../entity/employee/entity/index.js';
import { get, insert } from "../../../tools/repository-generic/index.js";

export interface EmployeeRepository {
    CreateEmployee(sm: pg.PoolClient, p: Employee): Promise<EmployeeAuthResult>;
    GetEmployeeByLogin(sm: pg.PoolClient, login: string) : Promise<Employee>;
}

export class EmployeeRepositoryImpl implements EmployeeRepository {
    public CreateEmployee(sm: pg.PoolClient, p: Employee): Promise<EmployeeAuthResult> {
        const sqlQuery = `
        INSERT INTO employees(ar_id, fio, login, password)
        VALUES (${p.ar_id}, '${p.fio}', '${p.login}', '${p.password}')
        RETURNING empl_id, ar_id, login`

        return insert(sm, sqlQuery, true)
    }

    public GetEmployeeByLogin(sm: pg.PoolClient, login: string): Promise<Employee> {
        const sqlQuery = `
        SELECT e.empl_id, e.ar_id, e.fio, e.login, e.password
        FROM employees e
        WHERE e.login = $1
        ADNE e.deleted = false`

        return get(sm, sqlQuery, [login])
    }
}