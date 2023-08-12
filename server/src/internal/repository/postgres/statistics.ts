import pg from 'pg';
import { CommonStatistics } from "../../entity/statistics/entity/index.js";
import { get } from '../../../tools/repository-generic/index.js';

export interface StatisticsRepository {
    LoadCommonStatistics(sm: pg.PoolClient) : Promise<CommonStatistics[]>;
}

export class StatisticsRepositoryImpl implements StatisticsRepository {
    LoadCommonStatistics(sm: pg.PoolClient) :  Promise<CommonStatistics[]> {
        const sqlQuery = `
        SELECT 
            SUM(pp.price) as sales_sum, 
            CAST( SUM(psa.amount) as INTEGER ) as sales_amount,
            CAST( (SELECT SUM(prs.amount) FROM product$stocks prs) as INTEGER ) as product_amount,
            CAST( (SELECT COUNT(s.stock_id) FROM stocks s) as INTEGER) as stock_amount,
            CAST( (SELECT COUNT(em.empl_id) FROM employees em) as INTEGER) as employee_count
        FROM product$sales psa
          JOIN product$price pp ON(pp.variation_id = psa.variation_id)
        `  
        return get(sm, sqlQuery)
    }
}