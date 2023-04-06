import { Product, ProductPayload } from './../../entity/product/index.js';
import pgPromise from "pg-promise";


export interface ProductRepoInter {
    getProductByID(ts: pgPromise.ITask<{}>, id: number): Promise<Product>;
    createProduct(ts: pgPromise.ITask<{}>, p: ProductPayload): Promise<Product>;
    findProductList(ts: pgPromise.ITask<{}>, limit: number, offset: number): Promise<Product[]>;
}

export class ProductRepository implements ProductRepoInter {
    async getProductByID(ts: pgPromise.ITask<{}>, id: number): Promise<Product> {
        const sqlQuery = `
        SELECT pr.product_id, pr.product_name, pr.description, pr.tags, pr.creation_date
        FROM product pr
        WHERE pr.product_id = $1
        AND pr.deleted = false`

        return ts.one(sqlQuery, id)
    }

    async createProduct(ts: pgPromise.ITask<{}>, p: ProductPayload): Promise<Product> {
        const sqlQuery = `
        INSERT INTO product(product_name, description, tags)
        VALUES ('${p.product_name}', '${p.description}', '${p.tags}')
        RETURNING product_id, product_name, description, tags, creation_date`

        return ts.one(sqlQuery)
    }

    async findProductList(ts: pgPromise.ITask<{}>, limit: number, offset: number): Promise<Product[]> {
        const sqlQuery = `
        SELECT pr.product_id, pr.product_name, pr.description, pr.tags, pr.creation_date
        FROM product pr
        DESC
        LIMIT = $1
        OFFSET = $2`

        return ts.one(sqlQuery, [limit, offset])
    }
}