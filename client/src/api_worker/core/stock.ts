import { LoadParams } from './../../../../server/src/internal/entity/global/entity/index';
import { StockListResponse } from "@/entity/stock/entity";
import { handleApiGetRequest } from "../axios";

export interface StockApiWorker {
    findEmployeeStockList(loadParams: LoadParams): Promise<StockListResponse>;
}

export class StockApiWorkerImpl implements StockApiWorker {
    findEmployeeStockList(loadParams: LoadParams): Promise<StockListResponse> {
        return handleApiGetRequest("find_empl_stocks", loadParams)
    }
}