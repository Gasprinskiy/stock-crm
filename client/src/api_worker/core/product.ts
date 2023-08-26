import { handleApiGetRequest } from '@/api_worker/axios/index';
import { FindProductListParam, FindProductVariatonParam } from "@/entity/product/param";
import { ProductListResponse, ProductVariation } from "@/entity/product/entity";

export interface ProductApiWorker {
    findSalesProductList(params: FindProductListParam): Promise<ProductListResponse>;
    findProductVariationByStockID(params: FindProductVariatonParam): Promise<ProductVariation[]>;
}

export class ProductApiWorkerImpl implements ProductApiWorker {
    findSalesProductList(params: FindProductListParam): Promise<ProductListResponse> {
        return handleApiGetRequest("product_list", params)
    }

    findProductVariationByStockID(params: FindProductVariatonParam): Promise<ProductVariation[]> {
        return handleApiGetRequest("product_variation_list", params)
    }
}