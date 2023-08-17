import pg from "pg";
import { select, getReturnField } from "../../../tools/repository-generic/index.js";
import { Stock } from "../../entity/stock/entity/entity.js";
import { LoadParams } from "../../entity/global/entity/index.js";

export interface StockRepositoryImplsitory {
    FindStockListByEmployeeID(sm: pg.PoolClient, empl_id: number, loadParams: LoadParams): Promise<Stock[]>;
    StockListCountByEmployeeID(sm: pg.PoolClient, empl_id: number, loadParams: LoadParams): Promise<number>;
    LoadStocks(sm: pg.PoolClient): Promise<Stock[]>;
}

export class StockRepositoryImpl implements StockRepositoryImplsitory {
    public FindStockListByEmployeeID(sm: pg.PoolClient, empl_id: number, loadParams: LoadParams): Promise<Stock[]> {
        const sqlQuery = `
        SELECT 
            st.stock_id, 
            st.stock_name as name, 
            st.address,
            CAST( SUM(psm.amount) AS INTEGER) as movement_in_count,
            CAST( SUM(pst.amount) as INTEGER ) as product_count
        FROM stocks st
            LEFT OUTER JOIN product$stocks pst ON(pst.stock_id = st.stock_id)
            LEFT OUTER JOIN product$stock_movements psm ON(psm.receiving_stock_id = st.stock_id AND psm.received = false)
            ${this.stockListByEmployeeIDFilterQuery(empl_id, loadParams)}`

        return select(sm, sqlQuery)
    }

    public StockListCountByEmployeeID(sm: pg.PoolClient, empl_id: number, loadParams: LoadParams): Promise<number> {
        const sqlQuery = `
        SELECT COUNT(st.stock_id) as stocks_count
        FROM stocks st
        ${this.stockListByEmployeeIDFilterQuery(empl_id, loadParams)}`

        return getReturnField(sm, sqlQuery, 'stocks_count')
    }

    public LoadStocks(sm: pg.PoolClient): Promise<Stock[]> {
        return select(sm, this.loadStockQuery)
    }

    private stockListByEmployeeIDFilterQuery(empl_id: number, loadParams: LoadParams): string {
        return `
        JOIN employee$stocks ems ON(ems.stock_id = st.stock_id)
        WHERE ems.empl_id = ${empl_id}
        GROUP BY st.stock_id
        ORDER BY st.stock_id
        DESC
        LIMIT ${loadParams.limit}
        OFFSET ${loadParams.offset}`
    }

    private get loadStockQuery() : string {
        return `
        SELECT 
            st.stock_id, 
            st.stock_name as name, 
            st.address
        FROM stocks st`
    }
}