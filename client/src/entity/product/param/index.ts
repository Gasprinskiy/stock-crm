import { LoadParams } from "@/entity/global/params";

export interface FindProductListParam extends LoadParams {
    stock_id: number;
    query: string | null;
}

export interface FindProductVariatonParam {
    stock_id: number;
    product_id: number;
}