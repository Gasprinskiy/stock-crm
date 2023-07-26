import pg from "pg";
import { select } from "../../../tools/pg-err-handler/index.js";
import { Stock } from "../../entity/stock/entity/entity.js";

export interface StockRepoInter {
    FindStockListByEmployeeID(ts: pg.PoolClient, empl_id: number): Promise<Stock[]>
}

export class StockRepo implements StockRepoInter {
    async FindStockListByEmployeeID(ts: pg.PoolClient, empl_id: number): Promise<Stock[]> {
        const sqlQuery = `
        SELECT st.stock_id, st.stock_name as name, st.address
        FROM stocks st
            JOIN employee$stocks ems ON(ems.stock_id = st.stock_id)
        WHERE ems.empl_id = $1`

        return select(ts, sqlQuery, [empl_id])
    }
}