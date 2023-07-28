
import pg from "pg";
import { Product, ProductMovement } from "../../entity/product/entity/index.js";
import { AddProductToStockParam, CreateProductParam, FindProductListParam, ProductMovementParam } from "../../entity/product/params/index.js"
import { insert, get, insertReturnID, select } from "../../../tools/repository-generic/index.js";
import { CountResponse } from "../../entity/global/entity/index.js";
import { AmountOperation } from "../../entity/product/constant/index.js";

export interface ProductRepoInter {
    GetProductByID(ts: pg.PoolClient, id: number): Promise<Product>;
    CreateProduct(ts: pg.PoolClient, p: CreateProductParam): Promise<number>;
    CreateProductVariation(ts: pg.PoolClient, product_id: number, v_type_id: number): Promise<number>;
    AddProductToStock(ts: pg.PoolClient, params: AddProductToStockParam): Promise<number>;
    FindProductListByStockID(ts: pg.PoolClient, p: FindProductListParam, stockID: number): Promise<Product[]>;
    FindProductCount(ts: pg.PoolClient, p: FindProductListParam, stockID: number): Promise<number>;
    SendProductsToStockRecieve(ts: pg.PoolClient, p: ProductMovementParam): Promise<void>;
    DecreaseProductStockAmount(ts: pg.PoolClient, amount: number, accounting_id: number): Promise<void>;
    IncreaseProductStockAmount(ts: pg.PoolClient, amount: number, accounting_id: number): Promise<void>;
    LoadProductMovemetnHistory(ts: pg.PoolClient) : Promise<ProductMovement[]>;
    // LoadPriceRange(ts: pgPromise.ITask<object>): Promise<ProductPriceRange>
}

export class ProductRepository implements ProductRepoInter {
    public async GetProductByID(ts: pg.PoolClient, id: number): Promise<Product> {
        const sqlQuery = `
        SELECT pr.product_id, pr.product_name, pr.description, pr.tags, pr.creation_date
        FROM product pr
        WHERE pr.product_id = $1
        AND pr.deleted = false`
        
        return get(ts, sqlQuery, [id])
    }

    public async CreateProduct(ts: pg.PoolClient, p: CreateProductParam): Promise<number> {
        const sqlQuery = `
        INSERT INTO product(product_name, description, tags)
        VALUES ('${p.product_name}', '${p.description}', '${p.tags}')
        RETURNING product_id`

        return insertReturnID(ts, sqlQuery, 'product_id')
    }

    public async CreateProductVariation(ts: pg.PoolClient, product_id: number, v_type_id: number): Promise<number> {
        const sqlQuery = `
        INSERT INTO product$variations(product_id, v_type_id)
        VALUES ('${product_id}', '${v_type_id}')
        RETURNING variation_id`

        return insertReturnID(ts, sqlQuery, 'variation_id')
    }
    
    public async AddProductToStock(ts: pg.PoolClient, params: AddProductToStockParam): Promise<number> {
        const sqlQuery = `
        INSERT INTO product$stocks(stock_id, product_id, amount, variation_id)
        VALUES ('${params.stock_id}', '${params.product_id}', '${params.amount}', '${params.variation_id}')
        RETURNING accounting_id`

        return insertReturnID(ts, sqlQuery, 'accounting_id')
    }

    public async FindProductListByStockID(ts: pg.PoolClient, p: FindProductListParam, stockID: number): Promise<Product[]> {
        const sqlQuery = `
        SELECT 
            p.product_id, 
            p.product_name, 
            p.description, 
            p.tags,
            CAST(SUM(ps.amount) as INTEGER) as total_amount
        FROM product p
            JOIN product$stocks ps on(ps.product_id = p.product_id)
        ${this.findProductListFilterQuery(p, stockID)}
        ${this.findProductListGroupQuery(p)}`

        return select(ts, sqlQuery)
    }

    public async FindProductCount(ts: pg.PoolClient, p: FindProductListParam, stockID: number): Promise<number> {
        const sqlQuery = `
        SELECT count(DISTINCT p.product_id)
        FROM product p
            JOIN product$stocks ps ON(ps.product_id = p.product_id)
        ${this.findProductListFilterQuery(p, stockID)}`

        return get(ts, sqlQuery)
    }

    public async SendProductsToStockRecieve(ts: pg.PoolClient, p: ProductMovementParam): Promise<void> {
        const sqlQuery = `
        INSERT INTO product$stock_movements(accounting_id, receiving_stock_id, amount)
        VALUES('${p.accounting_id}', '${p.receiving_stock_id}', '${p.amount}')` 

        return insert(ts, sqlQuery)
    }

    public async DecreaseProductStockAmount(ts: pg.PoolClient, amount: number, accounting_id: number): Promise<void> {
        return insert(ts, this.changeProductStockAmountQuery(AmountOperation.decrease), false, [amount, accounting_id])
    }

    public async IncreaseProductStockAmount(ts: pg.PoolClient, amount: number, accounting_id: number): Promise<void> {
        return insert(ts, this.changeProductStockAmountQuery(AmountOperation.increase), false, [amount, accounting_id])
    }

    public async LoadProductMovemetnHistory(ts: pg.PoolClient) : Promise<ProductMovement[]> {
        const sqlQuery = `
        SELECT 
            p.product_name,
            vt.variation as variation_type,
            ut.type as unit_type,
            ss.stock_name as sending_stock,
            rs.stock_name as receiving_stock,
            psm.amount,
            psm.received
        FROM product$stock_movements psm
            JOIN product$stocks ps ON(ps.accounting_id = psm.accounting_id)
            JOIN stocks ss ON(ss.stock_id = ps.stock_id)
            JOIN stocks rs ON(rs.stock_id = psm.receiving_stock_id)
            JOIN product p ON(p.product_id = ps.product_id)
            JOIN product$variations pv ON(pv.variation_id = ps.variation_id)
            JOIN variation$types vt ON(vt.v_type_id = pv.v_type_id)
            JOIN unit$types ut ON(ut.u_type_id = vt.u_type_id)
        `

        return select(ts, sqlQuery)
    }

    private findProductListFilterQuery(p: FindProductListParam, stockID: number): string {
        return `
        WHERE ps.stock_id = COALESCE(${stockID}, ps.stock_id)
        ${p.price_range ? `AND (
            pr.price BETWEEN ${p.price_range.min_price} and ${p.price_range.max_price}
        )` : ""}
        ${p.query ? `AND (
            LOWER(p.product_name) like LOWER('%${p.query}%')
            OR
            LOWER(p.tags) like LOWER('%${p.query}%')
        )`: ""}
        ${p.show_all ? "" : "AND ps.amount > 0"}`
    }

    private findProductListGroupQuery(p: FindProductListParam): string {
        return `
        GROUP BY p.product_id
        ORDER BY p.product_id
        DESC
        LIMIT ${p.limit}
        OFFSET ${p.offset}`
    }

    private changeProductStockAmountQuery(operation: AmountOperation) {
        const operator = operation === AmountOperation.decrease ? '-' : '+'
        return `
        UPDATE 
            product$stocks 
        SET 
            amount = (amount ${operator} $1) 
        WHERE accounting_id = $2`
    }
}