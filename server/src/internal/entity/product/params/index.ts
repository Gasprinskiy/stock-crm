import { LoadParams } from "../../global/entity/index.js";

export interface CreateProductParam {
    product_name: string;
    description: string;
    tags: string;
    v_type_list: {amount: number; id: number;}[];
}

export interface FindProductListParam extends LoadParams {
    stock_id?: number;
    query?: string;
    show_all?: boolean;
    price_range?: {min: number; max: number};
}

export interface ProductPriceRange {
    min_price: number;
    max_price: number
}

export interface AddProductToStockParam {
    product_id: number;
    variation_id: number;
    stock_id: number;
    amount: number;
}

export interface ProductMovementParam {
    accounting_id: number;
    sending_stock_id: number;
    receiving_stock_id: number;
    amount: number;
}

export interface FindProductMovemetnHistoryParam extends LoadParams {
    received?: boolean;
    movement_date_range?: {min: string; max: string};
    sending_stock_id?: number;
    receiving_stock_id?: number;
    product_id?: number;   
}