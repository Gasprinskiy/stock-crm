import { LoadParams } from '@/entity/global/params/';
import { StockListResponse } from "@/entity/stock/entity";
import { handleApiGetRequest } from "../axios";

export interface StockApiWorker {
    findEmployeeProductStatStockList(loadParams: LoadParams): Promise<StockListResponse>;
    findSalesStatStockListByEmployeeID(loadParams: LoadParams): Promise<StockListResponse>;
}

export class StockApiWorkerImpl implements StockApiWorker {
    findEmployeeProductStatStockList(loadParams: LoadParams): Promise<StockListResponse> {
        return handleApiGetRequest("empl_product_stat_stocks", loadParams)
    }

    findSalesStatStockListByEmployeeID(loadParams: LoadParams): Promise<StockListResponse> {
        return handleApiGetRequest("empl_sales_stat_stocks", loadParams)
    }
}