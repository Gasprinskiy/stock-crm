import { StatisticsUsecase } from './core/statistics.js';
import { Repository } from "../repository/index.js"
import { ProductUsecase } from "./core/product.js";
import { EmployeeUsecase } from "./core/employee.js"; 
import { StockUsecase } from "./core/stock.js";


export class Usecase {
    //
    Product: ProductUsecase;
    Employee: EmployeeUsecase;
    Stock: StockUsecase;
    Statistics: StatisticsUsecase;
    constructor(repo: Repository){
        this.Product = new ProductUsecase(repo);
        this.Employee = new EmployeeUsecase(repo);
        this.Stock = new StockUsecase(repo)
        this.Statistics = new StatisticsUsecase(repo)
    }
}