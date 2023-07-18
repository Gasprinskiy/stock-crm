import pgPromise from "pg-promise";
import { Employee, EmployeeAuthResult } from '../../entity/employee/entity/index.js';
import { selectMany, selectOne } from "../../../tools/pg-err-handler/index.js";
import { Stock } from "../../entity/stock/entity.js";

export interface StockRepoInter {
    FindStockListByEmployeeID(ts: pgPromise.ITask<object>, empl_id: number): Promise<Stock[]>
}

export class StockRepo implements StockRepoInter {
    async FindStockListByEmployeeID(ts: pgPromise.ITask<object>, empl_id: number): Promise<Stock[]> {
        const sqlQuery = `
        SELECT st.stock_id, st.stock_name as name, st.address
        FROM stocks st
            JOIN employee$stocks ems ON(ems.stock_id = st.stock_id)
        WHERE ems.empl_id = $1`

        return selectMany(ts, sqlQuery, empl_id)
    }
}