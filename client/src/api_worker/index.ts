import { StatisticsApiWorker, StatisticsApiWorkerImpl } from './core/statistics';
import { InjectionKey } from 'vue'
import { EmployeeApiWorker, EmployeeApiWorkerImpl } from './core/employee'
import { StockApiWorker, StockApiWorkerImpl } from './core/stock'

type InjectionKeys = {[key: string]: InjectionKey<any>}
type InjectionImpl = {[key: string]: object}

export const EmployeeApiWorkerInjectionKey = Symbol() as InjectionKey<EmployeeApiWorker>
export const StockApiWorkerInjectionKey = Symbol() as InjectionKey<StockApiWorker>
export const StatisticsApiWorkerInjectionKey = Symbol() as InjectionKey<StatisticsApiWorker>

export const InjectionKeysMap: InjectionKeys = {
    employee: EmployeeApiWorkerInjectionKey,
    stock: StockApiWorkerInjectionKey,
    statistics: StatisticsApiWorkerInjectionKey
}

export const InjectionImplMap : InjectionImpl = {
    employee: new EmployeeApiWorkerImpl(),
    stock: new StockApiWorkerImpl(),
    statistics: new StatisticsApiWorkerImpl()
}