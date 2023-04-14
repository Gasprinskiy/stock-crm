export interface Product {
    product_id: number;
    product_name: string;
    description: string;
    tags: string;
    creation_date: Date;
}

// Параметры запросов
export interface CreateProductPayload {
    product_name: string;
    description: string;
    tags: string;
}

export interface FindProductListPayload {
    limit: number;
    offset: number;
    stock_id: number;
}