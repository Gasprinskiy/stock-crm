
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
    price_from: number | null;
    price_till: number | null;
    show_all: boolean;
}