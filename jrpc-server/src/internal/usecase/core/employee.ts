import pgPromise from "pg-promise";
import { Repository } from "../../repository/index.js";
import { AuthParams } from "../../entity/employee/params/index.js"; 
import { Employee, EmployeeAuthResult } from "../../entity/employee/entity/index.js";
import { InternalErrorsMap } from "../../entity/global/error/index.js";
import { EmployeeErrorsMap } from "../../entity/employee/error/index.js";
import { Logger } from '../../../tools/logger/index.js';
import { createHashPassword, checkHashPassword } from "../../../tools/passhash/index.js";
import { handleRepoDefaultError } from "../../../tools/usecase-err-handler/index.js";
import { translitLowercaseRuToEn } from "../../../tools/translit/index.js"


interface EmployeeUsecaseInter {
    CreateEmployee(ts: pgPromise.ITask<object>, p: Employee): Promise<EmployeeAuthResult | Error>;
    Auth(ts: pgPromise.ITask<object>, p: AuthParams): Promise<EmployeeAuthResult | Error>;
}

export class EmployeeUsecase implements EmployeeUsecaseInter {
    private repository: Repository;
    private log: Logger;

    constructor(repo: Repository) {
        this.repository = repo;
        this.log = new Logger("employee")
    }

    // CreateEmployee создать работника
    public async CreateEmployee(ts: pgPromise.ITask<object>, p: Employee): Promise<EmployeeAuthResult> {
        p.password = createHashPassword(p.password)
        p.login = this.createLogin(p.fio)

        return handleRepoDefaultError(() => {
            return this.repository.Employee.CreateEmployee(ts, p)
        }, this.log, "не удалось создать нового сотрудника")
    }

    // Auth авторизация
    public async Auth(ts: pgPromise.ITask<object>, p: AuthParams): Promise<EmployeeAuthResult> {        
        // поиск по логину
        const response = await this.repository.Employee.GetEmployeeByLogin(ts, p.login)
        if (response instanceof Error) {
            if (response === InternalErrorsMap.ErrNoData) {
                throw EmployeeErrorsMap.ErrWrongLoginOrPassword
            }
            this.log.Error(`не удалось найти сотрудника по логину, ошибка: ${response.message}`)
            throw InternalErrorsMap.ErrInternalError
        }
        
        // проверка захешированного пароля
        const passwordCorrect = checkHashPassword(response.password, p.password)
        if (!passwordCorrect) {
            throw EmployeeErrorsMap.ErrWrongLoginOrPassword
        }

        const result : EmployeeAuthResult = {
            ar_id: response.ar_id,
            stock_id: response.stock_id,
            fio: response.fio,
            login: p.login
        }

        return result
    }

    private createLogin(fio: string): string {
        const spliteFio = translitLowercaseRuToEn(fio).split(" ")
        return `${spliteFio[0]}.${spliteFio[1]}`
    }
}