import { Repository } from "../../repository/index.js"
import { Logger } from '../../../tools/logger/index.js'
import { Product, CreateProductPayload, FindProductListPayload } from './../../entity/product/index.js';
import pgPromise from "pg-promise";

export interface ProdcuctUsecaseInter {
    repository: Repository;
    log: Logger;

    getProductByID(ts: pgPromise.ITask<{}>, id: number): Promise<Product|Error>;
    createProduct(ts: pgPromise.ITask<{}>, p: CreateProductPayload): Promise<Product|Error>;
    findProductList(ts: pgPromise.ITask<{}>, p: FindProductListPayload): Promise<Product[]|Error>;
}

export class ProdcuctUsecase implements ProdcuctUsecaseInter {
    repository: Repository;
    log: Logger;
    constructor(repo: Repository) {
        this.repository = repo;
        this.log = new Logger("product")
    }

    async getProductByID(ts: pgPromise.ITask<{}>, id: number): Promise<Product | Error> {
        return {
            product_id: 0,
            product_name: "string",
            description: "string",
            tags: "string",
            creation_date: new Date()
        }
    }
}