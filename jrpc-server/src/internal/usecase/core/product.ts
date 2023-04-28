import { Repository } from "../../repository/index.js"
import { Logger } from '../../../tools/logger/index.js'
import { Product, CreateProductPayload, FindProductListPayload } from './../../entity/product/index.js';
import { Usecase } from '../index.js'
import { handleRepoDefaultError } from "../../../tools/errhandler/usecase/index.js";
import pgPromise from "pg-promise";

interface ProdcuctUsecaseInter {
    getProductByID(ts: pgPromise.ITask<{}>, id: number): Promise<Product|Error>;
    createProduct(ts: pgPromise.ITask<{}>, p: CreateProductPayload): Promise<Product|Error>;
    findProductList(ts: pgPromise.ITask<{}>, p: FindProductListPayload): Promise<Product[]|Error>;
}

export class ProductUsecase implements ProdcuctUsecaseInter {
    private repository: Repository;
    private log: Logger;
    private bridge: Usecase;

    constructor(repo: Repository, bi: Usecase) {
        this.repository = repo;
        this.bridge = bi
        this.log = new Logger("product")
    }

    async getProductByID(ts: pgPromise.ITask<{}>, id: number): Promise<Product | Error> {
        return handleRepoDefaultError(() => {
            return this.repository.Product.getProductByID(ts, id)
        }, this.log, "не удалось получить продукт по ID")
    }

    async createProduct(ts: pgPromise.ITask<{}>, p: CreateProductPayload): Promise<Product | Error> {
        return handleRepoDefaultError(() => {
            return this.repository.Product.createProduct(ts, p)
        }, this.log, "не удалось создать продукт")
    }

    async findProductList(ts: pgPromise.ITask<{}>, p: FindProductListPayload): Promise<Product[] | Error> {
        return handleRepoDefaultError(() => {
            return this.repository.Product.findProductList(ts, p)
        }, this.log, "не удалось найти список продуктов")
    }

    sumThenMinus(a: number, b: number, c: number): number {
        const sum = this.bridge.Tempalte.sum(a, b)
        return sum - c
    } 
}