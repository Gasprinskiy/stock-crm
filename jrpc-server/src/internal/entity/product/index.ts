export interface Product {
    product_id: number;
    product_name: string;
    description: string;
    tags: string;
    creation_date: Date;
}

export interface ProductPayload {
    product_name: string;
    description: string;
    tags: string;
}