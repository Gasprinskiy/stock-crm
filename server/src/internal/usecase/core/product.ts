import { InternalErrorsMap } from '../../entity/global/error/index.js';
import pgPromise from "pg-promise";
import { Repository } from "../../repository/index.js";
import { Logger, LoggerFields } from "../../../tools/logger/index.js"
import { Product, ProductListResponse } from '../../entity/product/entity/index.js';
import { CreateProductParam, FindProductListParam } from "../../entity/product/params/index.js"
import { handleRepoDefaultError } from "../../../tools/usecase-err-handler/index.js";

interface ProdcuctUsecaseInter {
    GetProductByID(ts: pgPromise.ITask<object>, id: number): Promise<Product|Error>;
    CreateProduct(ts: pgPromise.ITask<object>, p: CreateProductParam): Promise<Product|Error>;
    FindProductList(ts: pgPromise.ITask<object>, p: FindProductListParam, employee_login: string): Promise<ProductListResponse>;
}

export class ProductUsecase implements ProdcuctUsecaseInter {
    private repository: Repository;
    private log: Logger;

    constructor(repo: Repository) {
        this.repository = repo;
        this.log = new Logger("product")
    }

    public async GetProductByID(ts: pgPromise.ITask<object>, id: number): Promise<Product> {
        return handleRepoDefaultError(() => {
            return this.repository.Product.GetProductByID(ts, id)
        }, this.log, "не удалось получить продукт по ID")
    }

    public async CreateProduct(ts: pgPromise.ITask<object>, p: CreateProductParam): Promise<Product> {
        return handleRepoDefaultError(() => {
            return this.repository.Product.CreateProduct(ts, p)
        }, this.log, "не удалось создать продукт")
    }
    
    // FindProductList поиск товаров
    public async FindProductList(ts: pgPromise.ITask<object>, p: FindProductListParam, employee_login: string): Promise<ProductListResponse> {
        const lf: LoggerFields = {
            "employee_login": employee_login
        }
        try {
            // получить работника по логину что бы далее загружать продукты по складу к которому он прикреплен
            const employeeResponse = await this.repository.Employee.GetEmployeeByLogin(ts, employee_login)

            try {
                // выставить корренктный параметр offset перед загрузкой списка товаров
                p.offset = p.offset - 1
                p.offset = p.limit * p.offset

                // поиск списока товаров
                const productResponse = await this.repository.Product.FindProductListByStockID(ts, p, employeeResponse.stock_id)

                try {
                    const pageCountResponse = await this.repository.Product.FindProductCount(ts, p, employeeResponse.stock_id)

                    return {
                        product_list: productResponse,
                        page_count: Math.ceil(pageCountResponse.count / p.limit)
                    }
                    
                } catch(err: any) {
                    this.log.WithFields(lf).Error(err, 'не удалось загрузить общее количество товара, ошибка')
                    throw InternalErrorsMap.ErrInternalError
                }
            } catch(err: any) {
                if (err === InternalErrorsMap.ErrNoData) {
                    throw InternalErrorsMap.ErrNoData
                }
                this.log.WithFields(lf).Error(err, 'не удалось загрузить список продуктов')
                throw InternalErrorsMap.ErrInternalError
            } 
        } catch(err: any) {
            this.log.WithFields(lf).Error(err, 'не удалось найти сотрудника по логину')
            throw InternalErrorsMap.ErrInternalError
        }
    }
}