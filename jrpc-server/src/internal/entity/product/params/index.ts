
export interface CreateProductParam {
    product_name: string;
    description: string;
    tags: string;
}

export interface FindProductListParam {
    limit: number;
    offset: number;
    employee_login: string;
}