import { EmployeeRepoInter, EmployeeRepo } from "./postgres/employee.js";
import { ProductRepoInter, ProductRepository } from "./postgres/product.js";
import { StockRepoInter, StockRepo } from "./postgres/stock.js";

export class Repository {
    Product: ProductRepoInter;
    Employee: EmployeeRepoInter;
    Stock: StockRepoInter;
    constructor(){
        this.Product = new ProductRepository();
        this.Employee = new EmployeeRepo()
        this.Stock = new StockRepo()
    }
}