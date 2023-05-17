
import pgPromise from "pg-promise";

import { Repository } from "../../repository/index.js"
import { Logger } from '../../../tools/logger/index.js'
import { AccesRight } from "../../entity/employee/constant/index.js"
import { AuthParams } from "../../entity/employee/params/index.js"
import { Employee } from "../../entity/employee/entity/index.js";
import { EmployeeAuthResult } from "../../entity/employee/entity/index.js";

import { createHashPassword, checkHashPassword } from "../../../tools/passhash/index.js";
import { handleRepoDefaultError } from "../../../tools/errhandler/usecase/index.js";

import { GlobalErrorsMap } from "../../entity/global/index.js";
import EmployeeErrorsMap from "../../entity/employee/error/index.js"

interface EmployeeUsecaseInter {
    createEmployee(ts: pgPromise.ITask<{}>, p: Employee): Promise<EmployeeAuthResult | Error>;
    auth(ts: pgPromise.ITask<{}>, p: AuthParams): Promise<EmployeeAuthResult | Error>;
}

export class EmployeeUsecase implements EmployeeUsecaseInter {
    private repository: Repository;
    private log: Logger;

    constructor(repo: Repository) {
        this.repository = repo;
        this.log = new Logger("employee")
    }

    async createEmployee(ts: pgPromise.ITask<{}>, p: Employee): Promise<EmployeeAuthResult | Error> {
        p.password = createHashPassword(p.password)
        return handleRepoDefaultError(()=>{
            return this.repository.Employee.createEmployee(ts, p)
        }, this.log, "не удалось создать нового сотрудника")
    }

    async auth(ts: pgPromise.ITask<{}>, p: AuthParams): Promise<EmployeeAuthResult | Error> {
        const response = await this.repository.Employee.getEmployeeByLogin(ts, p.login)
        if (response instanceof Error) {
            if (response == GlobalErrorsMap.ErrNoData) {
                return EmployeeErrorsMap.ErrPassOrLoginIncorrect
            }
            this.log.Error(`не удалось найти сотрудника по логину, ошибка: ${response.message}`)
            return GlobalErrorsMap.ErrInternalError
        }

        const passwordCorrect = checkHashPassword(response.password, p.password)
        if (!passwordCorrect) {
            return EmployeeErrorsMap.ErrPassOrLoginIncorrect
        }

        const result : EmployeeAuthResult = {
            ar_id: response.ar_id,
            stock_id: response.stock_id,
            fio: response.fio,
        }

        return result
    }
}