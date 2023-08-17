import pg from "pg";
import moment from "moment"
import { InternalErrorsMap } from '../../entity/global/error/index.js';
import { Repository } from "../../repository/index.js";
import { Logger, LoggerFields } from "../../../tools/logger/index.js"
import { Product, ProductListResponse, ProductMovement } from '../../entity/product/entity/index.js';
import { CreateProductParam, FindProductListParam, FindProductMovemetnHistoryParam, ProductMovementParam } from "../../entity/product/params/index.js"
import { handleRepoDefaultError } from "../../../tools/usecase-generic/index.js";
import { DistributionStockID } from '../../entity/stock/constant/index.js';
import { caclLoadParamsOffset } from '../../../tools/calc/index.js';
import { date_time_format } from '../../../tools/datefunctions/index.js';

export class ProductUsecase {
    private repository: Repository;
    private log: Logger;

    constructor(repo: Repository) {
        this.repository = repo;
        this.log = new Logger("product")
    }

    public GetProductByID(sm: pg.PoolClient, id: number): Promise<Product> {
        return handleRepoDefaultError(() => {
            return this.repository.Product.GetProductByID(sm, id)
        }, this.log, "не удалось получить продукт по ID")
    }

    public async CreateProduct(sm: pg.PoolClient, p: CreateProductParam, employee_login: string): Promise<number> {
        const lf: LoggerFields = {
            "employee_login": employee_login
        }
        try {
            const productID = await this.repository.Product.CreateProduct(sm, p)

            try {
                for (const i in p.v_type_list) {
                    const v_type = p.v_type_list[i]
                    const variationIDResponse = await this.repository.Product.CreateProductVariation(sm, productID, v_type.id)
                    await this.repository.Product.AddProductToStock(sm, {
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
    public async FindProductList(sm: pg.PoolClient, p: FindProductListParam): Promise<ProductListResponse> {
        
        try {
            // выставить корренктный параметр offset перед загрузкой списка товаров
            p.offset = caclLoadParamsOffset({
                offset: p.offset,
                limit: p.limit,
            })

            // поиск списока товаров
            const productResponse = await this.repository.Product.FindProductListByStockID(sm, p)

            try {
                const pageCountResponse = await this.repository.Product.FindProductCount(sm, p)

                return {
                    product_list: productResponse,
                    page_count: Math.ceil(pageCountResponse / p.limit)
                }
                
            } catch(err: any) {
                this.log.Error(err, 'не удалось загрузить общее количество товара, ошибка')
                throw err
            }
        } catch(err: any) {
            if (err === InternalErrorsMap.ErrNoData) {
                throw InternalErrorsMap.ErrNoData
            }
            this.log.Error(err, 'не удалось загрузить список продуктов')
            throw InternalErrorsMap.ErrInternalError
        }
    }

    public async SendProductsToStockRecieve(sm: pg.PoolClient, p: ProductMovementParam, employee_login: string): Promise<number> {
        const lf: LoggerFields = {
            "employee_login": employee_login,
            "accounting_id": p.accounting_id,
            "sending_stock_id": p.sending_stock_id,
            "receiving_stock_id": p.receiving_stock_id,
            "amount": p.amount
        }
        try {
            const movementID = await this.repository.Product.SendProductsToStockRecieve(sm, p);
            await this.repository.Product.DecreaseProductStockAmount(sm, p.amount, p.accounting_id);

            this.log.WithFields(lf).Info("совершено отправка продукта со склада на склад")
            return movementID
        } catch(err: any) {
            this.log.WithFields(lf).Error(err, "не удалось отправить продукта со склада на склад")
            throw err
        }
    }

    public async FindProductMovemetnHistory(sm: pg.PoolClient, p: FindProductMovemetnHistoryParam) : Promise<ProductMovement[]> {
        p.offset = caclLoadParamsOffset({
            offset: p.offset,
            limit: p.limit,
        })

        if(p.movement_date_range) {
            p.movement_date_range.min = moment(p.movement_date_range.min).format(date_time_format)
            p.movement_date_range.max = moment(p.movement_date_range.max).format(date_time_format)         
        }

        return handleRepoDefaultError(() => {
            return this.repository.Product.FindProductMovemetnHistory(sm, p)
        }, this.log, "не удалось загрузить историю перемещений продукта")
    }

    public async RecieveProduct(sm: pg.PoolClient, p: ProductMovement, employee_login: string): Promise<void> {
        const lf: LoggerFields = {
            "employee_login": employee_login,
            "sending_stock_id": p.sending_stock_id,
            "receiving_stock_id": p.receiving_stock_id,
            "product_id": p.product_id,
            "variation_id": p.variation_id
        }

        try {
            const existAccountingID = await this.repository.Product.FindExistAccounting(sm, p.sending_accounting_id, p.receiving_stock_id)
            await this.repository.Product.IncreaseProductStockAmount(sm, p.amount, existAccountingID)
        } catch(err: any) {
            switch (err) {
                case InternalErrorsMap.ErrNoData:
                    try {
                        await this.repository.Product.AddProductToStock(sm, {
                            stock_id: p.receiving_stock_id,
                            product_id: p.product_id,
                            amount: p.amount,
                            variation_id: p.variation_id,
                        })
                    } catch(err: any) {
                        this.log.WithFields(lf).Error(err, "не удалось добавить новый товар на склад")
                        throw InternalErrorsMap.ErrInternalError
                    }
                break

                default:
                    this.log.WithFields(lf).Error(err, "не удалось совершить приемку товара")
                    throw InternalErrorsMap.ErrInternalError
            }
        }

        try {
            await this.repository.Product.MarkMovementAsReceived(sm, p.mvmnt_id)
            this.log.WithFields(lf).Info("прием товара завершен")
        } catch(err: any) {
            this.log.WithFields(lf).Error(err, "не удалось совершить приемку товара, ошибка при попытке пометить приемку как полученное")
            throw InternalErrorsMap.ErrInternalError
        }
    }
}