import { Stock } from "@/entity/stock/entity";
import { handleApiGetRequest } from "../axios";

export interface StockApiWorker {
    findEmployeeStockList(): Promise<Stock[]>;
}

export class StockApiWorkerImpl implements StockApiWorker {
    findEmployeeStockList(): Promise<Stock[]> {
        return handleApiGetRequest("find_empl_stocks")
    }
}