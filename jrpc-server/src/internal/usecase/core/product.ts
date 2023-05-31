import { GlobalErrorsMap } from '../../entity/global/error/index.js';
import pgPromise from "pg-promise";
import { Repository } from "../../repository/index.js";
import { Logger } from "../../../tools/logger/index.js"
import { Product } from '../../entity/product/entity/index.js';
import { CreateProductParam, FindProductListParam } from "../../entity/product/params/index.js"
import { handleRepoDefaultError } from "../../../tools/usecaseerrhandler/index.js";
import { removeArrayDublicateByKey } from '../../../tools/unique/index.js';

interface ProdcuctUsecaseInter {
    GetProductByID(ts: pgPromise.ITask<{}>, id: number): Promise<Product|Error>;
    CreateProduct(ts: pgPromise.ITask<{}>, p: CreateProductParam): Promise<Product|Error>;
    FindProductList(ts: pgPromise.ITask<{}>, p: FindProductListParam): Promise<Product[]|Error>;
}

export class ProductUsecase implements ProdcuctUsecaseInter {
    private repository: Repository;
    private log: Logger;

    constructor(repo: Repository) {
        this.repository = repo;
        this.log = new Logger("product")
    }

    public async GetProductByID(ts: pgPromise.ITask<{}>, id: number): Promise<Product | Error> {
        return handleRepoDefaultError(() => {
            return this.repository.Product.GetProductByID(ts, id)
        }, this.log, "не удалось получить продукт по ID")
    }

    public async CreateProduct(ts: pgPromise.ITask<{}>, p: CreateProductParam): Promise<Product | Error> {
        return handleRepoDefaultError(() => {
            return this.repository.Product.CreateProduct(ts, p)
        }, this.log, "не удалось создать продукт")
    }

    public async FindProductList(ts: pgPromise.ITask<{}>, p: FindProductListParam): Promise<Product[] | Error> {
        const employeeResponse = await this.repository.Employee.GetEmployeeByLogin(ts, p.employee_login)
        if (employeeResponse instanceof Error) {
            this.log.Error(`не удалось найти сотрудника по логину, ошибка: ${employeeResponse}`)
            return GlobalErrorsMap.ErrInternalError
        } 
        // выставить корренктный параметр offset перед загрузкой списка товаров
        p.offset = p.offset - 1
        p.offset = p.limit * p.offset

        const productResponse = await this.repository.Product.FindProductList(ts, p.limit, p.offset)
        if (productResponse instanceof Error) {
            if (productResponse == GlobalErrorsMap.ErrNoData) {
                return productResponse
            }
            this.log.Error(`не удалось загрузить список продуктов, ошибка: ${productResponse}`)
            return GlobalErrorsMap.ErrInternalError
        } 

        // если сотрудник прикреплен к складу
        if (employeeResponse.stock_id) {
            return productResponse.filter(item => item.stock_id === employeeResponse.stock_id)
        }

        // если сотрудник не привязан к складу, удалить дубликаты из массива
        return removeArrayDublicateByKey('product_id', productResponse)
    }
}