import { RedisClientType } from "redis";
import { EmployeeRepository, EmployeeRepositoryImpl } from "./postgres/employee.js";
import { ProductRepository, ProductRepositoryImpl } from "./postgres/product.js";
import { StockRepositoryImplsitory, StockRepositoryImpl } from "./postgres/stock.js";
import { EmployeeCache, EmployeeCacheImpl } from "./redis/employee_chache.js";
import { StatisticsRepository, StatisticsRepositoryImpl } from './postgres/statistics.js';

export class Repository {
    Product: ProductRepository;
    Employee: EmployeeRepository;
    EmployeeCache: EmployeeCache;
    Stock: StockRepositoryImplsitory;
    Statistics: StatisticsRepository;
    constructor(params:{
        redis: RedisClientType
    }){
        this.Product = new ProductRepositoryImpl();
        this.Employee = new EmployeeRepositoryImpl()
        this.Stock = new StockRepositoryImpl()
        this.EmployeeCache = new EmployeeCacheImpl(params.redis)
        this.Statistics = new StatisticsRepositoryImpl()
    }
}