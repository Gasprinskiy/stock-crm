export interface Product {
    product_id: number;
    product_name: string;
    description: string;
    tags: string;
    creation_date: Date;
    stock_id: number;
}

export interface ProductListResponse {
    product_list: Product[];
    page_count: number;
}