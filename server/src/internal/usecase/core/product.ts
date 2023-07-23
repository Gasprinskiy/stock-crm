import { InternalErrorsMap } from '../../entity/global/error/index.js';
import pgPromise from "pg-promise";
import { Repository } from "../../repository/index.js";
import { Logger, LoggerFields } from "../../../tools/logger/index.js"
import { Product, ProductListResponse } from '../../entity/product/entity/index.js';
import { CreateProductParam, FindProductListParam } from "../../entity/product/params/index.js"
import { handleRepoDefaultError } from "../../../tools/usecase-err-handler/index.js";
import { DistributionStockID } from '../../entity/stock/constant/index.js';

interface ProdcuctUsecaseInter {
    GetProductByID(ts: pgPromise.ITask<object>, id: number): Promise<Product>;
    CreateProduct(ts: pgPromise.ITask<object>, p: CreateProductParam): Promise<number>;
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

    public async CreateProduct(ts: pgPromise.ITask<object>, p: CreateProductParam): Promise<number> {
        try {
            const productID = await this.repository.Product.CreateProduct(ts, p)

            p.v_type_list.forEach(async v_type => {
                try {
                    const variationID = await this.repository.Product.CreateProductVariation(ts, productID, v_type.id)
                    
                    try {
                        // все создаваемые продукты в первую очередь попадают в склад распределния
                        await this.repository.Product.AddProductToStock(ts, {
                            stock_id: DistributionStockID,
                            product_id: productID,
                            amount: v_type.amount,
                            variation_id: variationID,
                        })
                    } catch(err: any) {
                        this.log.Error(err, 'не добавить продукт на склад распределения')
                        throw InternalErrorsMap.ErrInternalError
                    }

                } catch(err: any) {
                    this.log.Error(err, 'не создать вариацию продукта')
                    throw InternalErrorsMap.ErrInternalError
                }
            })

            return productID
        } catch(err: any) {
            this.log.Error(err, 'не удалось создать продукт')
            throw InternalErrorsMap.ErrInternalError
        }
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