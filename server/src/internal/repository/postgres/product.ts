import pgPromise from "pg-promise";
import { Product } from "../../entity/product/entity/index.js";
import { CreateProductParam, FindProductListParam, ProductPriceRange } from "../../entity/product/params/index.js"
import { selectOne, selectMany } from "../../../tools/pg-err-handler/index.js";
import { CountResponse } from "../../entity/global/entity/index.js";

export interface ProductRepoInter {
    GetProductByID(ts: pgPromise.ITask<object>, id: number): Promise<Product>;
    CreateProduct(ts: pgPromise.ITask<object>, p: CreateProductParam): Promise<Product>;
    FindProductListByStockID(ts: pgPromise.ITask<object>, p: FindProductListParam, stockID: number): Promise<Product[]>;
    FindProductCount(ts: pgPromise.ITask<object>,  p: FindProductListParam, stockID: number): Promise<CountResponse>;
    // LoadPriceRange(ts: pgPromise.ITask<object>): Promise<ProductPriceRange>
}

export class ProductRepository implements ProductRepoInter {
    public async GetProductByID(ts: pgPromise.ITask<object>, id: number): Promise<Product> {
        const sqlQuery = `
        SELECT pr.product_id, pr.product_name, pr.description, pr.tags, pr.creation_date
        FROM product pr
        WHERE pr.product_id = $1
        AND pr.deleted = false`
        
        return selectOne(ts, sqlQuery, id)
    }

    public async CreateProduct(ts: pgPromise.ITask<object>, p: CreateProductParam): Promise<Product> {
        const sqlQuery = `
        INSERT INTO product(product_name, description, tags)
        VALUES ('${p.product_name}', '${p.description}', '${p.tags}')
        RETURNING product_id, product_name, description, tags, creation_date`

        return ts.one(sqlQuery)
    }

    public async FindProductListByStockID(ts: pgPromise.ITask<object>, p: FindProductListParam, stockID: number): Promise<Product[]> {
        const sqlQuery = `
        SELECT 
            p.product_id, 
            p.product_name, 
            p.description, 
            p.tags,
            CAST(SUM(ps.amount) as INTEGER) as total_amount
        FROM product p
            JOIN product$stocks ps on(ps.product_id = p.product_id)
        ${this.findProductListFilterQuery(p, stockID)}
        ${this.findProductListGroupQuery(p)}`

        return selectMany(ts, sqlQuery)
    }

    public async FindProductCount(ts: pgPromise.ITask<object>, p: FindProductListParam, stockID: number): Promise<CountResponse> {
        const sqlQuery = `
        SELECT count(DISTINCT p.product_id)
        FROM product p
            JOIN product$stocks ps ON(ps.product_id = p.product_id)
        ${this.findProductListFilterQuery(p, stockID)}`

        return selectOne(ts, sqlQuery, stockID)
    }

    // public async LoadPriceRange(ts: pgPromise.ITask<object>): Promise<ProductPriceRange> {
    //     return {
    //         min_price: 0,
    //         max_price: 10000.0
    //     }
    // }

    private findProductListFilterQuery(p: FindProductListParam, stockID: number): string {
        return `
        WHERE ps.stock_id = COALESCE(${stockID}, ps.stock_id)
        ${p.price_range ? `AND (
            pr.price BETWEEN ${p.price_range.min_price} and ${p.price_range.max_price}
        )` : ""}
        ${p.query ? `AND (
            LOWER(p.product_name) like LOWER('%${p.query}%')
            OR
            LOWER(p.tags) like LOWER('%${p.query}%')
        )`: ""}
        ${p.show_all ? "" : "AND ps.amount > 0"}`
    }

    private findProductListGroupQuery(p: FindProductListParam): string {
        return `
        GROUP BY p.product_id
        ORDER BY p.product_id
        DESC
        LIMIT ${p.limit}
        OFFSET ${p.offset}`
    }
}