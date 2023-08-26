export interface Product {
    product_id: number;
    stock_id: number;
    product_name: string;
}
export interface StockProduct extends Product {
    description: string;
    tags: string;
    total_amount: number;
}

export interface SaleProduct extends Product {
    variation_id: number;
    price: number;
    amount: number;
}

export interface ProductListResponse {
    product_list: Product[];
    page_count: number;
}

export interface ProductVariation {
    variation_id: number;
    variation_name: string;
    price: number;
    amount: number;
}

export interface ProductVariationSelectItem extends ProductVariation {
    label: string;
    value: number;
    disabled: boolean;
}