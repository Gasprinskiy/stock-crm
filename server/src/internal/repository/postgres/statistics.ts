import pg from 'pg';
import { CommonStatistics } from "../../entity/statistics/entity/index.js";
import { select } from '../../../tools/repository-generic/index.js';

export interface StatisticsRepository {
    LoadCommonStatistics(sm: pg.PoolClient) : Promise<CommonStatistics[]>;
}

export class StatisticsRepositoryImpl implements StatisticsRepository {
    LoadCommonStatistics(sm: pg.PoolClient) :  Promise<CommonStatistics[]> {
        const sqlQuery = `
        SELECT 
            SUM(pp.price) as sales_sum, 
            SUM(psa.amount) as sales_amount,
            (SELECT SUM(prs.amount) FROM product$stocks prs) as product_amount,
            (SELECT COUNT(s.stock_id) FROM stocks s) as stock_amount,
            (SELECT COUNT(em.empl_id) FROM employees em) as employee_count
        FROM product$sales psa
          JOIN product$price pp ON(pp.variation_id = psa.variation_id)
        `  
        return select(sm, sqlQuery)
    }
}