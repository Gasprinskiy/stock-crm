import pg from "pg";
import { InternalErrorsMap } from "../../entity/global/error/index.js";
import { Repository } from "../../repository/index.js";
import { Logger } from '../../../tools/logger/index.js';
import { handleRepoDefaultError } from "../../../tools/usecase-generic/index.js";
import { Stock, StockListResponse } from "../../entity/stock/entity/entity.js";
import { LoadParams } from "../../entity/global/entity/index.js";
import { caclLoadParamsOffset } from "../../../tools/calc/index.js";

export class StockUsecase {
    private repository: Repository;
    private log: Logger;

    constructor(repo: Repository) {
        this.repository = repo;
        this.log = new Logger("stock")
    }

    async FindStockListByEmployeeID(sm: pg.PoolClient, empl_id: number, loadParams: LoadParams): Promise<StockListResponse> {
        try {
            loadParams.offset = caclLoadParamsOffset({
                offset: loadParams.offset,
                limit: loadParams.limit,
            })

            const stocksList = await this.repository.Stock.FindStockListByEmployeeID(sm, empl_id, loadParams)
            
            try {
                const stocksCount = await this.repository.Stock.StockListCountByEmployeeID(sm, empl_id, loadParams)

                return {
                    stock_list: stocksList,
                    page_count: Math.ceil(stocksCount / loadParams.limit)
                }
            } catch(err: any) {
                this.log.Error(err, 'не удалось загрузить общее количество складов, ошибка')
                throw err
            }
        } catch(err: any) {
            if (err === InternalErrorsMap.ErrNoData) {
                throw InternalErrorsMap.ErrNoData
            }
            this.log.Error(err, 'не удалось загрузить список складов по ID сотрудника')
            throw InternalErrorsMap.ErrInternalError
        }
    }

    LoadStocks(sm: pg.PoolClient): Promise<Stock[]> {
        return handleRepoDefaultError(() => {
            return this.repository.Stock.LoadStocks(sm)
        }, this.log, "не удалось загрузить список складов")
    }
}
