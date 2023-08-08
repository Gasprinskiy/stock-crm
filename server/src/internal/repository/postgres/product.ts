
import pg from "pg";
import { Product, ProductMovement } from "../../entity/product/entity/index.js";
import { AddProductToStockParam, CreateProductParam, FindProductListParam, FindProductMovemetnHistoryParam, ProductMovementParam } from "../../entity/product/params/index.js"
import { insert, get, insertReturnID, select, getReturnField } from "../../../tools/repository-generic/index.js";
import { CountResponse } from "../../entity/global/entity/index.js";
import { AmountOperation } from "../../entity/product/constant/index.js";

export interface ProductRepository {
    GetProductByID(ts: pg.PoolClient, id: number): Promise<Product>;
    CreateProduct(ts: pg.PoolClient, p: CreateProductParam): Promise<number>;
    CreateProductVariation(ts: pg.PoolClient, product_id: number, v_type_id: number): Promise<number>;
    AddProductToStock(ts: pg.PoolClient, params: AddProductToStockParam): Promise<number>;
    FindProductListByStockID(ts: pg.PoolClient, p: FindProductListParam): Promise<Product[]>;
    FindProductCount(ts: pg.PoolClient, p: FindProductListParam): Promise<number>;
    SendProductsToStockRecieve(ts: pg.PoolClient, p: ProductMovementParam): Promise<number>;
    DecreaseProductStockAmount(ts: pg.PoolClient, amount: number, accounting_id: number): Promise<void>;
    IncreaseProductStockAmount(ts: pg.PoolClient, amount: number, accounting_id: number): Promise<void>;
    FindProductMovemetnHistory(ts: pg.PoolClient, p: FindProductMovemetnHistoryParam) : Promise<ProductMovement[]>;
    FindProductStockMovementByID(ts: pg.PoolClient, mvmnt_id: number): Promise<ProductMovement[]>;
    FindProductStockMovementIn(ts: pg.PoolClient, stock_id: number): Promise<ProductMovement[]>;
    FindProductStockMovementOut(ts: pg.PoolClient, stock_id: number): Promise<ProductMovement[]>;
    FindExistAccounting(ts: pg.PoolClient, accounting_id: number, stock_id: number) : Promise<number>;
    MarkMovementAsReceived(ts: pg.PoolClient, mvmnt_id: number): Promise<void>;
    // LoadPriceRange(ts: pgPromise.ITask<object>): Promise<ProductPriceRange>
}

export class ProductRepositoryImpl implements ProductRepository {
    public GetProductByID(ts: pg.PoolClient, id: number): Promise<Product> {
        const sqlQuery = `
        SELECT pr.product_id, pr.product_name, pr.description, pr.tags, pr.creation_date
        FROM product pr
        WHERE pr.product_id = $1
        AND pr.deleted = false`
        
        return get(ts, sqlQuery, [id])
    }

    public CreateProduct(ts: pg.PoolClient, p: CreateProductParam): Promise<number> {
        const sqlQuery = `
        INSERT INTO product(product_name, description, tags)
        VALUES ('${p.product_name}', '${p.description}', '${p.tags}')
        RETURNING product_id`

        return insertReturnID(ts, sqlQuery, 'product_id')
    }

    public CreateProductVariation(ts: pg.PoolClient, product_id: number, v_type_id: number): Promise<number> {
        const sqlQuery = `
        INSERT INTO product$variations(product_id, v_type_id)
        VALUES ('${product_id}', '${v_type_id}')
        RETURNING variation_id`

        return insertReturnID(ts, sqlQuery, 'variation_id')
    }
    
    public AddProductToStock(ts: pg.PoolClient, params: AddProductToStockParam): Promise<number> {
        const sqlQuery = `
        INSERT INTO product$stocks(stock_id, product_id, amount, variation_id)
        VALUES ('${params.stock_id}', '${params.product_id}', '${params.amount}', '${params.variation_id}')
        RETURNING accounting_id`

        return insertReturnID(ts, sqlQuery, 'accounting_id')
    }

    public FindProductListByStockID(ts: pg.PoolClient, p: FindProductListParam): Promise<Product[]> {
        const sqlQuery = `
        SELECT 
            p.product_id,
            ps.stock_id, 
            p.product_name, 
            p.description, 
            p.tags,
            CAST(SUM(ps.amount) as INTEGER) as total_amount
        FROM product p
            JOIN product$stocks ps on(ps.product_id = p.product_id)
        ${this.findProductListFilterQuery(p)}
        ${this.findProductListGroupQuery(p)}`

        return select(ts, sqlQuery)
    }

    public FindProductCount(ts: pg.PoolClient, p: FindProductListParam): Promise<number> {
        const sqlQuery = `
        SELECT count(DISTINCT p.product_id)
        FROM product p
            JOIN product$stocks ps ON(ps.product_id = p.product_id)
        ${this.findProductListFilterQuery(p)}`

        return getReturnField(ts, sqlQuery, 'count')
    }

    public SendProductsToStockRecieve(ts: pg.PoolClient, p: ProductMovementParam): Promise<number> {
        const sqlQuery = `
        INSERT INTO product$stock_movements(accounting_id, receiving_stock_id, amount)
        VALUES('${p.accounting_id}', '${p.receiving_stock_id}', '${p.amount}')
        RETURNING mvmnt_id` 

        return insertReturnID(ts, sqlQuery, 'mvmnt_id')
    }

    public DecreaseProductStockAmount(ts: pg.PoolClient, amount: number, accounting_id: number): Promise<void> {
        return insert(ts, this.changeProductStockAmountQuery(AmountOperation.decrease), false, [amount, accounting_id])
    }

    public IncreaseProductStockAmount(ts: pg.PoolClient, amount: number, accounting_id: number): Promise<void> {
        return insert(ts, this.changeProductStockAmountQuery(AmountOperation.increase), false, [amount, accounting_id])
    }

    public FindProductMovemetnHistory(ts: pg.PoolClient, p: FindProductMovemetnHistoryParam) : Promise<ProductMovement[]> {
        return select(ts, this.findProductMovemetnHistoryFilterQuery(p) + this.findProductMovemetnHistoryGroupQuery(p))
    }

    public FindProductStockMovementByID(ts: pg.PoolClient, mvmnt_id: number): Promise<ProductMovement[]> {
        return select(ts, this.productMovementHistoryQuery + "WHERE psm.mvmnt_id = $1", [mvmnt_id])
    }

    public FindProductStockMovementIn(ts: pg.PoolClient, stock_id: number): Promise<ProductMovement[]> {
        return select(ts, this.productMovementHistoryQuery + "WHERE rs.stock_id = $1", [stock_id])
    }

    public FindProductStockMovementOut(ts: pg.PoolClient, stock_id: number): Promise<ProductMovement[]> {
        return select(ts, this.productMovementHistoryQuery + "WHERE ss.stock_id = $1", [stock_id])
    }

    public FindExistAccounting(ts: pg.PoolClient, accounting_id: number, stock_id: number) : Promise<number> {
        const sqlQuery = `
        SELECT ps.accounting_id
        FROM product$stocks ps
            JOIN product$stocks psm ON(psm.product_id = ps.product_id AND psm.variation_id = ps.variation_id)
        WHERE psm.accounting_id = $1
        AND ps.accounting_id != $1
        AND ps.stock_id = $2`

        return getReturnField(ts, sqlQuery, 'accounting_id', [accounting_id, stock_id])
    }

    public MarkMovementAsReceived(ts: pg.PoolClient, mvmnt_id: number): Promise<void> {
        const sqlQuery = `
        UPDATE 
            product$stock_movements
        SET
            received = true
        WHERE mvmnt_id = $1
        `

        return insert(ts, sqlQuery, false, [mvmnt_id])
    }

    private get productMovementHistoryQuery(): string {
        return `
        SELECT 
            psm.mvmnt_id,
            p.product_name,
            p.product_id,
            vt.variation as variation_type,
            pv.variation_id,
            ut.type as unit_type,
            ss.stock_name as sending_stock,
            ss.stock_id as sending_stock_id,
            ps.accounting_id as sending_accounting_id,
            rs.stock_name as receiving_stock,
            rs.stock_id as receiving_stock_id,
            psm.amount,
            psm.received,
            psm.movement_date
        FROM product$stock_movements psm
            JOIN product$stocks ps ON(ps.accounting_id = psm.accounting_id)
            JOIN stocks ss ON(ss.stock_id = ps.stock_id)
            JOIN stocks rs ON(rs.stock_id = psm.receiving_stock_id)
            JOIN product p ON(p.product_id = ps.product_id)
            JOIN product$variations pv ON(pv.variation_id = ps.variation_id)
            JOIN variation$types vt ON(vt.v_type_id = pv.v_type_id)
            JOIN unit$types ut ON(ut.u_type_id = vt.u_type_id)
        `
    }

    private findProductListFilterQuery(p: FindProductListParam): string {
        return `
        WHERE ${p.stock_id ? `ps.stock_id = ${p.stock_id}` : 'ps.stock_id = ps.stock_id'}
        ${p.price_range ? `AND (
            pr.price BETWEEN ${p.price_range.min} and ${p.price_range.max}
        )` : ""}
        ${p.query ? `AND (
            LOWER(p.product_name) like LOWER('%${p.query}%')
            OR
            LOWER(p.tags) like LOWER('%${p.query}%')
        )`: ""}
        ${p.show_all === true ? "" : "AND ps.amount > 0"}`
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

    private findProductMovemetnHistoryFilterQuery(p: FindProductMovemetnHistoryParam): string {
        return `
        ${this.productMovementHistoryQuery}
        WHERE ${p.received !== null ? `psm.received = ${p.received}` : 'psm.received = true OR psm.received = false'}
        ${p.movement_date_range ? `AND psm.movement_date BETWEEN '${p.movement_date_range.min}' AND '${p.movement_date_range.max}'` : ''}
        ${p.sending_stock_id ? `AND ss.stock_id = ${p.sending_stock_id}` : ''}
        ${p.receiving_stock_id ? `AND rs.stock_id = ${p.receiving_stock_id}` : ''}
        ${p.product_id ? `AND p.product_id = ${p.product_id}` : ''}
        `
    }

    private findProductMovemetnHistoryGroupQuery(p: FindProductMovemetnHistoryParam) : string {
        return `
        ORDER BY psm.movement_date
        DESC
        LIMIT ${p.limit}
        OFFSET ${p.offset}
        `
    }
}