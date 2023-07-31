import pg from "pg";
import { Repository } from "../../repository/index.js";;
import { Logger, LoggerFields } from '../../../tools/logger/index.js';
import { handleRepoDefaultError } from "../../../tools/usecase-generic/index.js";
import { Stock } from "../../entity/stock/entity/entity.js";


interface StockUsecaseInter {
    FindStockListByEmployeeID(ts: pg.PoolClient, empl_id: number): Promise<Stock[]>;
    LoadStocks(ts: pg.PoolClient): Promise<Stock[]>;
}

export class StockUsecase implements StockUsecaseInter {
    private repository: Repository;
    private log: Logger;

    constructor(repo: Repository) {
        this.repository = repo;
        this.log = new Logger("stock")
    }

    FindStockListByEmployeeID(ts: pg.PoolClient, empl_id: number): Promise<Stock[]> {
        const lf : LoggerFields = {
            "empl_id": empl_id
        }
        return handleRepoDefaultError(() => {
            return this.repository.Stock.FindStockListByEmployeeID(ts, empl_id)
        }, this.log.WithFields(lf), "не удалось загрузить список складов по ID сотрудника")
    }

    LoadStocks(ts: pg.PoolClient): Promise<Stock[]> {
        return handleRepoDefaultError(() => {
            return this.repository.Stock.LoadStocks(ts)
        }, this.log, "не удалось загрузить список складов")
    }
}
