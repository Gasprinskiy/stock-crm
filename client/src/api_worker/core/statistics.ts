import { CommonStatistics } from "@/entity/statistics/entity";
import { handleApiGetRequest, handleApiPostRequest } from "../axios";

export interface StatisticsApiWorker {
    loadCommonStatistics(): Promise<CommonStatistics>
}

export class StatisticsApiWorkerImpl {
    loadCommonStatistics(): Promise<CommonStatistics> {
        return handleApiGetRequest('common_statistics')
    }
}