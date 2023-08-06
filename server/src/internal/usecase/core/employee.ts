import pg from "pg";

import { Repository } from "../../repository/index.js";
import { AuthParams } from "../../entity/employee/params/index.js"; 
import { Employee, EmployeeAuthResult } from "../../entity/employee/entity/index.js";
import { InternalErrorsMap } from "../../entity/global/error/index.js";
import { EmployeeErrorsMap } from "../../entity/employee/error/index.js";
import { Logger, LoggerFields } from '../../../tools/logger/index.js';
import { createHashPassword, checkHashPassword } from "../../../tools/passhash/index.js";
import { handleRepoDefaultError } from "../../../tools/usecase-generic/index.js";
import { translitLowercaseRuToEn } from "../../../tools/translit/index.js"


interface EmployeeUsecaseInter {
    CreateEmployee(ts: pg.PoolClient, p: Employee): Promise<EmployeeAuthResult | Error>;
    LogIn(ts: pg.PoolClient, p: AuthParams): Promise<EmployeeAuthResult | Error>;
}

export class EmployeeUsecase implements EmployeeUsecaseInter {
    private repository: Repository;
    private log: Logger;

    constructor(repo: Repository) {
        this.repository = repo;
        this.log = new Logger("employee")
    }

    // CreateEmployee создать работника
    public async CreateEmployee(ts: pg.PoolClient, p: Employee): Promise<EmployeeAuthResult> {
        p.password = createHashPassword(p.password)
        p.login = this.createLogin(p.fio)

        try {
            await this.repository.Employee.GetEmployeeByLogin(ts, p.login)
            throw EmployeeErrorsMap.EmployeeAlreadyExist
        } catch(err: any) {
            if (err === InternalErrorsMap.ErrNoData) {
                return handleRepoDefaultError(() => {
                    return this.repository.Employee.CreateEmployee(ts, p)
                }, this.log, "не удалось создать нового сотрудника")
            }
            throw err
        } 
    }

    // LogIn авторизация
    public async LogIn(ts: pg.PoolClient, p: AuthParams): Promise<EmployeeAuthResult> {        
        const lf: LoggerFields = {
            "auth_login": p.login
        } 
        // поиск по логину
        try {
            const response = await this.repository.Employee.GetEmployeeByLogin(ts, p.login)

            // проверка захешированного пароля
            const passwordCorrect = checkHashPassword(response.password, p.password)
            if (!passwordCorrect) {
                throw EmployeeErrorsMap.ErrWrongLoginOrPassword
            }

            return {
                empl_id: response.empl_id,
                ar_id: response.ar_id,
                login: response.login
            }
        } catch(err: any) {
            if(err === InternalErrorsMap.ErrNoData || err === EmployeeErrorsMap.ErrWrongLoginOrPassword) {
                throw EmployeeErrorsMap.ErrWrongLoginOrPassword
            }
            this.log.WithFields(lf).Error(err, 'не удалось найти сотрудника по логину')
            throw InternalErrorsMap.ErrInternalError
        }
    }

    private createLogin(fio: string): string {
        const spliteFio = translitLowercaseRuToEn(fio.toLocaleLowerCase()).split(" ")
        return `${spliteFio[0]}.${spliteFio[1]}`
    }
}
