import { InjectionKey } from 'vue'
import { EmployeeApiWorker, EmployeeApiWorkerImpl } from './core/employee'
import { StatisticsApiWorker, StatisticsApiWorkerImpl } from './core/statistics';
import { StockApiWorker, StockApiWorkerImpl } from './core/stock'
import { ProductApiWorker, ProductApiWorkerImpl } from './core/product';
import { SalesApiWorker, SalesApiWorkerImpl } from './core/sales';

type InjectionKeys = {[key: string]: InjectionKey<any>}
type InjectionImpl = {[key: string]: object}

export const ProductApiWorkerInjectionKey = Symbol() as InjectionKey<ProductApiWorker>
export const EmployeeApiWorkerInjectionKey = Symbol() as InjectionKey<EmployeeApiWorker>
export const StockApiWorkerInjectionKey = Symbol() as InjectionKey<StockApiWorker>
export const StatisticsApiWorkerInjectionKey = Symbol() as InjectionKey<StatisticsApiWorker>
export const SalesApiWorkerInjectionKey = Symbol() as InjectionKey<SalesApiWorker>

const InjectionKeysMap: InjectionKeys = {
    employee: EmployeeApiWorkerInjectionKey,
    stock: StockApiWorkerInjectionKey,
    statistics: StatisticsApiWorkerInjectionKey,
    product: ProductApiWorkerInjectionKey,
    sales: SalesApiWorkerInjectionKey
}

const InjectionImplMap : InjectionImpl = {
    employee: new EmployeeApiWorkerImpl(),
    stock: new StockApiWorkerImpl(),
    statistics: new StatisticsApiWorkerImpl(),
    product: new ProductApiWorkerImpl(),
    sales: new SalesApiWorkerImpl()
}

export default {
    injection_keys: InjectionKeysMap,
    injection_impl: InjectionImplMap
}