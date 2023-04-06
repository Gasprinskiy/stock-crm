import pgPromise from "pg-promise";
import { Product, ProductPayload } from '../entity/product/index.js';

export interface ProductRepo {
    getProductByID(ts: pgPromise.ITask<{}>, id: number): Promise<Product>;
    createProduct(ts: pgPromise.ITask<{}>, p: ProductPayload): Promise<Product>;
    findProductList(ts: pgPromise.ITask<{}>, limit: number, offset: number): Promise<Product[]>;
}