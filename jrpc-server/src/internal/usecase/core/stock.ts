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
import { Stock } from "../../entity/stock/entity.js";


interface StockUsecaseInter {
    FindStockListByEmployeeID(ts: pgPromise.ITask<object>, empl_id: number): Promise<Stock[]>
}

export class StockUsecase implements StockUsecaseInter {
    private repository: Repository;
    private log: Logger;

    constructor(repo: Repository) {
        this.repository = repo;
        this.log = new Logger("stock")
    }

    async FindStockListByEmployeeID(ts: pgPromise.ITask<object>, empl_id: number): Promise<Stock[]> {
        return [{
            stock_id: 0,
            name: 'string',
            address: 'string',
        }]
    }
}
