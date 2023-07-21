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