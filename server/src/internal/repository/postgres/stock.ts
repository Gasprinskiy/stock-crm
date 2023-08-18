import pg from "pg";
import { select, getReturnField } from "../../../tools/repository-generic/index.js";
import { Stock, StockProductStats, StockSaleStats } from "../../entity/stock/entity/entity.js";
import { LoadParams } from "../../entity/global/entity/index.js";

export interface StockRepositoryImplsitory {
    FindStockProductStatsListByEmployeeID(sm: pg.PoolClient, empl_id: number, loadParams: LoadParams): Promise<StockProductStats[]>;
    FindStockSaleStatsListByEmployeeID(sm: pg.PoolClient, empl_id: number, loadParams: LoadParams): Promise<StockSaleStats[]>;
    StockListCountByEmployeeID(sm: pg.PoolClient, empl_id: number, loadParams: LoadParams): Promise<number>;
    LoadStocks(sm: pg.PoolClient): Promise<Stock[]>;
}

export class StockRepositoryImpl implements StockRepositoryImplsitory {
    public FindStockProductStatsListByEmployeeID(sm: pg.PoolClient, empl_id: number, loadParams: LoadParams): Promise<StockProductStats[]> {
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

    public FindStockSaleStatsListByEmployeeID(sm: pg.PoolClient, empl_id: number, loadParams: LoadParams): Promise<StockSaleStats[]> {
        const sqlQuery = `
        WITH day_sales AS (
            SELECT 
                ps.sale_id,
                CAST( SUM(pr.price) AS INTEGER) as sales
            FROM product$sales ps
                JOIN product$price pr ON(pr.variation_id = ps.variation_id)
            WHERE ps.sold_date >= date_trunc('day', current_timestamp) AND ps.sold_date <= current_timestamp 
            GROUP BY ps.sale_id
        ), 
        total_sales AS (
            SELECT 
                ps.sale_id,
                CAST( SUM(pr.price) AS INTEGER) as sales
            FROM product$sales ps
                JOIN product$price pr ON(pr.variation_id = ps.variation_id)
            GROUP BY ps.sale_id
        )

        SELECT 
            st.stock_id, 
            st.stock_name as name,
            st.address, 
            ds.sales as today_sales,
            ts.sales as total_sales
        FROM stocks st
            LEFT OUTER JOIN product$sales ps ON(ps.stock_id = st.stock_id)
            LEFT OUTER JOIN day_sales ds ON(ds.sale_id = ps.sale_id)
            LEFT OUTER JOIN total_sales ts ON(ts.sale_id = ps.sale_id)
            ${this.stockListByEmployeeIDFilterQuery(empl_id, loadParams)}
        `

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
        const sqlQuery = `
        SELECT 
            st.stock_id, 
            st.stock_name as name, 
            st.address
        FROM stocks st`

        return select(sm, sqlQuery)
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
}