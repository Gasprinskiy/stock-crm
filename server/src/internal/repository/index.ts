import { RedisClientType } from "redis";
import { EmployeeRepoInter, EmployeeRepo } from "./postgres/employee.js";
import { ProductRepoInter, ProductRepository } from "./postgres/product.js";
import { StockRepoInter, StockRepo } from "./postgres/stock.js";
import { EmployeeCacheInter, EmployeeCache } from "./redis/employee_chache.js";

export class Repository {
    Product: ProductRepoInter;
    Employee: EmployeeRepoInter;
    EmployeeCache: EmployeeCacheInter;
    Stock: StockRepoInter;
    constructor(params:{redis: RedisClientType}){
        this.Product = new ProductRepository();
        this.Employee = new EmployeeRepo()
        this.Stock = new StockRepo()
        this.EmployeeCache = new EmployeeCache(params.redis)
    }
}