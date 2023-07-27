
export interface CreateProductParam {
    product_name: string;
    description: string;
    tags: string;
    v_type_list: {amount: number; id: number;}[];
}

export interface FindProductListParam {
    limit: number;
    offset: number;
    query: string | null;
    show_all: boolean;
    price_range: ProductPriceRange;
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
    product_id: number;
    accounting_id: number;
    sending_stock_id: number;
    receiving_stock_id: number;
    amount: number;
}