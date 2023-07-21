import pgPromise from "pg-promise";
import { Repository } from "../../repository/index.js";;
import { Logger } from '../../../tools/logger/index.js';
import { handleRepoDefaultError } from "../../../tools/usecase-err-handler/index.js";
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
        return handleRepoDefaultError(() => {
            return this.repository.Stock.FindStockListByEmployeeID(ts, empl_id)
        }, this.log, "не загрузить список складов")
    }
}
