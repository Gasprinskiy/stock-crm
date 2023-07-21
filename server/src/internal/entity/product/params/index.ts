
export interface CreateProductParam {
    product_name: string;
    description: string;
    tags: string;
}

export interface FindProductListParam {
    limit: number;
    offset: number;
    employee_login: string;
    query: string | null;
    show_all: boolean;
    price_range: ProductPriceRange;
}

export interface ProductPriceRange {
    min_price: number;
    max_price: number
}