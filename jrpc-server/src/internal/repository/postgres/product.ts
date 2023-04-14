import { handleRequestError } from '../../../tools/errhandler/pg/index.js';
import { Product, CreateProductPayload, FindProductListPayload } from './../../entity/product/index.js';
import pgPromise from "pg-promise";


export interface ProductRepoInter {
    getProductByID(ts: pgPromise.ITask<{}>, id: number): Promise<Product|Error>;
    createProduct(ts: pgPromise.ITask<{}>, p: CreateProductPayload): Promise<Product|Error>;
    findProductList(ts: pgPromise.ITask<{}>, p: FindProductListPayload): Promise<Product[]|Error>;
}

export class ProductRepository implements ProductRepoInter {
    async getProductByID(ts: pgPromise.ITask<{}>, id: number): Promise<Product|Error> {
        const sqlQuery = `
        SELECT pr.product_id, pr.product_name, pr.description, pr.tags, pr.creation_date
        FROM product pr
        WHERE pr.product_id = $1
        AND pr.deleted = false`
        
        return handleRequestError(() => {
            return ts.one(sqlQuery, id)
        })
    }

    async createProduct(ts: pgPromise.ITask<{}>, p: CreateProductPayload): Promise<Product|Error> {
        const sqlQuery = `
        INSERT INTO product(product_name, description, tags)
        VALUES ('${p.product_name}', '${p.description}', '${p.tags}')
        RETURNING product_id, product_name, description, tags, creation_date`

        return handleRequestError(() => {
            return ts.one(sqlQuery)
        })
    }

    async findProductList(ts: pgPromise.ITask<{}>, p: FindProductListPayload): Promise<Product[]|Error> {
        const sqlQuery = `
        SELECT pr.product_id, pr.product_name, pr.description, pr.tags, pr.creation_date, ps.amount
        FROM product pr
            JOIN product$stocks ps on(ps.product_id = pr.product_id)
        WHERE ps.stock_id = ${p.stock_id}
        DESC
        LIMIT = ${p.limit}
        OFFSET = ${p.offset}`

        return handleRequestError(() => {
            return ts.many(sqlQuery)
        })
    }
}