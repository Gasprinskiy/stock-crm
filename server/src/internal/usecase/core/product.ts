import { InternalErrorsMap } from '../../entity/global/error/index.js';
import pg from "pg";

import { Repository } from "../../repository/index.js";
import { Logger, LoggerFields } from "../../../tools/logger/index.js"
import { Product, ProductListResponse, ProductMovement } from '../../entity/product/entity/index.js';
import { CreateProductParam, FindProductListParam, FindProductMovemetnHistoryParam, ProductMovementParam } from "../../entity/product/params/index.js"
import { handleRepoDefaultError } from "../../../tools/usecase-generic/index.js";
import { DistributionStockID } from '../../entity/stock/constant/index.js';
import { caclLoadParamsOffset } from '../../../tools/calc/index.js';
import { makeDateString } from '../../../tools/datefunctions/index.js';

interface ProdcuctUsecaseInter {
    GetProductByID(ts: pg.PoolClient, id: number): Promise<Product>;
    CreateProduct(ts: pg.PoolClient, p: CreateProductParam, employee_login: string): Promise<number>;
    FindProductList(ts: pg.PoolClient, p: FindProductListParam, employee_login: string): Promise<ProductListResponse>;
    SendProductsToStockRecieve(ts: pg.PoolClient, p: ProductMovementParam, employee_login: string): Promise<void>;
    FindProductMovemetnHistory(ts: pg.PoolClient, p: FindProductMovemetnHistoryParam) : Promise<ProductMovement[]>
}

export class ProductUsecase implements ProdcuctUsecaseInter {
    private repository: Repository;
    private log: Logger;

    constructor(repo: Repository) {
        this.repository = repo;
        this.log = new Logger("product")
    }

    public async GetProductByID(ts: pg.PoolClient, id: number): Promise<Product> {
        return handleRepoDefaultError(() => {
            return this.repository.Product.GetProductByID(ts, id)
        }, this.log, "не удалось получить продукт по ID")
    }

    public async CreateProduct(ts: pg.PoolClient, p: CreateProductParam, employee_login: string): Promise<number> {
        const lf: LoggerFields = {
            "employee_login": employee_login
        }
        try {
            const productID = await this.repository.Product.CreateProduct(ts, p)

            try {
                for (let i in p.v_type_list) {
                    const v_type = p.v_type_list[i]
                    const variationIDResponse = await this.repository.Product.CreateProductVariation(ts, productID, v_type.id)
                    await this.repository.Product.AddProductToStock(ts, {
                        stock_id: DistributionStockID,
                        product_id: productID,
                        amount: v_type.amount,
                        variation_id: variationIDResponse,
                    })
                }
            } catch(err: any) {
                this.log.WithFields(lf).Error(err, "не удалось создать вариацию продукта или добавить его в склад")
                throw InternalErrorsMap.ErrInternalError
            }

            this.log.WithFields(lf).Info(`продукт ${p.product_name} создан, и добавлен на склад распределния`)
            return productID
        } catch(err: any) {
            if (err !== InternalErrorsMap.ErrInternalError) {
                this.log.WithFields(lf).Error(err, 'не удалось создать продукт')
            }
            throw InternalErrorsMap.ErrInternalError
        }
    }
    
    // FindProductList поиск товаров
    public async FindProductList(ts: pg.PoolClient, p: FindProductListParam, employee_login: string): Promise<ProductListResponse> {
        const lf: LoggerFields = {
            "employee_login": employee_login
        }
        try {
            // получить работника по логину что бы далее загружать продукты по складу к которому он прикреплен
            const employeeResponse = await this.repository.Employee.GetEmployeeByLogin(ts, employee_login)

            try {
                // выставить корренктный параметр offset перед загрузкой списка товаров
                p.offset = caclLoadParamsOffset({
                    offset: p.offset,
                    limit: p.limit,
                })

                // поиск списока товаров
                const productResponse = await this.repository.Product.FindProductListByStockID(ts, p, employeeResponse.stock_id)

                try {
                    const pageCountResponse = await this.repository.Product.FindProductCount(ts, p, employeeResponse.stock_id)

                    return {
                        product_list: productResponse,
                        page_count: Math.ceil(pageCountResponse / p.limit)
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

    public async SendProductsToStockRecieve(ts: pg.PoolClient, p: ProductMovementParam, employee_login: string): Promise<void> {
        const lf: LoggerFields = {
            "employee_login": employee_login,
            "accounting_id": p.accounting_id,
            "sending_stock_id": p.sending_stock_id,
            "receiving_stock_id": p.receiving_stock_id,
            "amount": p.amount
        }
        try {
            await this.repository.Product.SendProductsToStockRecieve(ts, p);
            await this.repository.Product.DecreaseProductStockAmount(ts, p.amount, p.accounting_id);

            this.log.WithFields(lf).Info("совершено отправка продукта со склада на склад")
        } catch(err: any) {
            this.log.WithFields(lf).Error(err, "не удалось отправить продукта со склада на склад")
            throw err
        }
    }

    public async FindProductMovemetnHistory(ts: pg.PoolClient, p: FindProductMovemetnHistoryParam) : Promise<ProductMovement[]> {
        p.offset = caclLoadParamsOffset({
            offset: p.offset,
            limit: p.limit,
        })

        if(p.movement_date_range) {
            p.movement_date_range.min = makeDateString(new Date(p.movement_date_range.min))
            p.movement_date_range.max = makeDateString(new Date(p.movement_date_range.max))
            console.log(
                `
                MIN: ${p.movement_date_range.min}\n
                MAX: ${p.movement_date_range.max}`
            );
            
        }

        return handleRepoDefaultError(() => {
            return this.repository.Product.FindProductMovemetnHistory(ts, p)
        }, this.log, "не удалось загрузить историю перемещений продукта")
    }
}