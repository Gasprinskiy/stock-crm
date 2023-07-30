export interface Product {
    product_id: number;
    product_name: string;
    description: string;
    tags: string;
    total_amount: number;
}

export interface ProductListResponse {
    product_list: Product[];
    page_count: number;
}

export interface ProductVariation {
    variation_id: number;
    product_id: number;
    v_type_id: number;
}

export interface ProductMovement {
    mvmnt_id: number;
    product_name: string;
    product_id: number;
    variation_type: number;
    variation_id: number;
    unit_type: string;
    sending_stock: string;
    sending_accounting_id: number;
    sending_stock_id: number;
    receiving_stock: string;
    receiving_stock_id: number;
    amount: number;
    received: boolean;
}