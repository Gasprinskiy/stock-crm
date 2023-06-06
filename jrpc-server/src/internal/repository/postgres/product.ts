import pgPromise from "pg-promise";
import { Product } from "../../entity/product/entity/index.js";
import { CreateProductParam, FindProductListParam, ProductPriceRange } from "../../entity/product/params/index.js"
import { handleRequestError } from "../../../tools/pgerrhandler/index.js";

export interface ProductRepoInter {
    GetProductByID(ts: pgPromise.ITask<{}>, id: number): Promise<Product|Error>;
    CreateProduct(ts: pgPromise.ITask<{}>, p: CreateProductParam): Promise<Product|Error>;
    FindProductList(ts: pgPromise.ITask<{}>, p: FindProductListParam, stockID: number): Promise<Product[]|Error>;
    FindProductCount(ts: pgPromise.ITask<{}>,  stockID: number): Promise<number|Error>;
    // LoadPriceRange(ts: pgPromise.ITask<{}>): Promise<ProductPriceRange|Error>
}

export class ProductRepository implements ProductRepoInter {
    public async GetProductByID(ts: pgPromise.ITask<{}>, id: number): Promise<Product|Error> {
        const sqlQuery = `
        SELECT pr.product_id, pr.product_name, pr.description, pr.tags, pr.creation_date
        FROM product pr
        WHERE pr.product_id = $1
        AND pr.deleted = false`
        
        return handleRequestError(() => {
            return ts.one(sqlQuery, id)
        })
    }

    public async CreateProduct(ts: pgPromise.ITask<{}>, p: CreateProductParam): Promise<Product|Error> {
        const sqlQuery = `
        INSERT INTO product(product_name, description, tags)
        VALUES ('${p.product_name}', '${p.description}', '${p.tags}')
        RETURNING product_id, product_name, description, tags, creation_date`

        return ts.one(sqlQuery)
    }

    public async FindProductList(ts: pgPromise.ITask<{}>, p: FindProductListParam, stockID: number): Promise<Product[]|Error> {
        const sqlQuery = `
        SELECT 
            p.product_id, 
            p.product_name, 
            p.description, 
            p.tags, 
            p.creation_date, 
            ps.amount, 
            ps.stock_id, 
            pr.price
        FROM product p
            JOIN product$stocks ps on(ps.product_id = p.product_id)
            LEFT OUTER JOIN product$price pr on(pr.variation_id = ps.variation_id)
        WHERE ps.stock_id = COALESCE(${stockID}, ps.stock_id)
        ${p.price_range ? `AND (
            pr.price BETWEEN ${p.price_range.max_price} and ${p.price_range.max_price}
        )` : ""}
        ${p.query ? `AND (
            LOWER(p.product_name) like LOWER('%${p.query}%')
            OR
            LOWER(p.tags) like LOWER('%${p.query}%')
        )`: ""}
        ${p.show_all ? "" : "AND ps.amount > 0"}
        ORDER BY p.product_id
        DESC
        LIMIT ${p.limit}
        OFFSET ${p.offset}`

        return handleRequestError(() => {
            return ts.many(sqlQuery)
        })
    }

    public async FindProductCount(ts: pgPromise.ITask<{}>, stockID: number): Promise<number|Error> {
        const sqlQuery = `
        SELECT count(pr.product_id)
        FROM product pr
            JOIN product$stocks ps ON(ps.product_id = pr.product_id)
        ${stockID ? `WHERE ps.stock_id = ${stockID}`: ""}`

        return handleRequestError(() => {
            return ts.one(sqlQuery, stockID)
        })
    }

    // public async LoadPriceRange(ts: pgPromise.ITask<{}>): Promise<ProductPriceRange|Error> {
    //     return {
    //         min_price: 0,
    //         max_price: 10000.0
    //     }
    // }
}