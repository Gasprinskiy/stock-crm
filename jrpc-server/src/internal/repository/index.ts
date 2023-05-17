import { EmployeeRepoInter, EmployeeRepo } from "./postgres/employee.js";
import { ProductRepoInter, ProductRepository } from "./postgres/product.js";

export class Repository {
    Product: ProductRepoInter;
    Employee: EmployeeRepoInter;
    constructor(){
        this.Product = new ProductRepository();
        this.Employee = new EmployeeRepo()
    }
}