import { GlobalErrorsMap, GlobalResponseErrors } from '../../entity/global/error/index.js';
import pgPromise from "pg-promise";
import { Repository } from "../../repository/index.js";
import { Logger } from "../../../tools/logger/index.js"
import { Product, ProductListResponse } from '../../entity/product/entity/index.js';
import { CreateProductParam, FindProductListParam } from "../../entity/product/params/index.js"
import { handleRepoDefaultError } from "../../../tools/usecaseerrhandler/index.js";
import { removeArrayObjectDublicateByKey } from '../../../tools/unique/index.js';

interface ProdcuctUsecaseInter {
    GetProductByID(ts: pgPromise.ITask<{}>, id: number): Promise<Product|Error>;
    CreateProduct(ts: pgPromise.ITask<{}>, p: CreateProductParam): Promise<Product|Error>;
    FindProductList(ts: pgPromise.ITask<{}>, p: FindProductListParam): Promise<ProductListResponse|Error>;
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
    
    // FindProductList стандартная загрузка списка товаров
    public async FindProductList(ts: pgPromise.ITask<{}>, p: FindProductListParam): Promise<ProductListResponse | Error> {
        const employeeResponse = await this.repository.Employee.GetEmployeeByLogin(ts, p.employee_login)
        if (employeeResponse instanceof Error) {
            this.log.Error(`не удалось найти сотрудника по логину, ошибка: ${employeeResponse}`)
            return GlobalErrorsMap.ErrInternalError
        } 
        // выставить корренктный параметр offset перед загрузкой списка товаров
        p.offset = p.offset - 1
        p.offset = p.limit * p.offset

        // список товаров
        const productResponse = await this.repository.Product.FindProductList(ts, p.limit, p.offset, employeeResponse.stock_id)
        if (productResponse instanceof Error) {
            if (productResponse === GlobalErrorsMap.ErrNoData) {
                return GlobalResponseErrors.ErrNoData
            }
            this.log.Error(`не удалось загрузить список продуктов, ошибка: ${productResponse}`)
            return GlobalResponseErrors.ErrInternalError
        }
        
        // количество страниц с продуктами
        const pageCountResponse = await this.repository.Product.FindProductCount(ts, employeeResponse.stock_id)
        if (pageCountResponse instanceof Error) {
            this.log.Error(`не удалось загрузить общее количество товара, ошибка: ${productResponse}`)
            return GlobalResponseErrors.ErrInternalError
        } 

        // если сотрудник прикреплен к складу
        if (employeeResponse.stock_id) {
            // вернуть результат как есть
            return {
                product_list: productResponse,
                page_count: Math.ceil(pageCountResponse / p.limit)
            }
        }
        
        // если сотрудник не привязан к складу, удалить дубликаты из массива
        return {
            product_list: removeArrayObjectDublicateByKey('product_id', productResponse),
            page_count: Math.ceil(pageCountResponse / p.limit)
        }
    }
}