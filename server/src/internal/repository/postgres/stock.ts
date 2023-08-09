import pg from "pg";
import { select } from "../../../tools/repository-generic/index.js";
import { Stock } from "../../entity/stock/entity/entity.js";

export interface StockRepositoryImplsitory {
    FindStockListByEmployeeID(sm: pg.PoolClient, empl_id: number): Promise<Stock[]>;
    LoadStocks(sm: pg.PoolClient): Promise<Stock[]>
}

export class StockRepositoryImpl implements StockRepositoryImplsitory {
    public FindStockListByEmployeeID(sm: pg.PoolClient, empl_id: number): Promise<Stock[]> {
        const sqlQuery = `
        ${this.loadStockQuery}
            JOIN employee$stocks ems ON(ems.stock_id = st.stock_id)
        WHERE ems.empl_id = $1`

        return select(sm, sqlQuery, [empl_id])
    }

    public LoadStocks(sm: pg.PoolClient): Promise<Stock[]> {
        return select(sm, this.loadStockQuery)
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