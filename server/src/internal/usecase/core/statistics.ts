import pg from 'pg';
import { handleRepoDefaultError } from '../../../tools/usecase-generic/index.js';
import { Logger } from '../../../tools/logger/index.js';
import { Repository } from '../../repository/index.js';
import { CommonStatistics } from '../../entity/statistics/entity/index.js';

export class StatisticsUsecase {
    private repository: Repository;
    private log: Logger;

    constructor(repo: Repository) {
        this.repository = repo;
        this.log = new Logger("statistics")
    }

    LoadCommonStatistics(sm: pg.PoolClient) :  Promise<CommonStatistics[]> {
        return handleRepoDefaultError(() => {
            return this.repository.Statistics.LoadCommonStatistics(sm)
        }, this.log, "не удалось загрузить статистику")
    }
}