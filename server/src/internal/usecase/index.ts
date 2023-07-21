import { Repository } from "../repository/index.js"
import { ProductUsecase } from "./core/product.js";
import { TemplateUsecase } from "./core/template.js";
import { EmployeeUsecase } from "./core/employee.js"; 
import { StockUsecase } from "./core/stock.js";


export class Usecase {
    //
    Product: ProductUsecase;
    Employee: EmployeeUsecase;
    Tempalte: TemplateUsecase;
    Stock: StockUsecase;
    constructor(repo: Repository){
        this.Product = new ProductUsecase(repo);
        this.Employee = new EmployeeUsecase(repo);
        this.Tempalte = new TemplateUsecase();
        this.Stock = new StockUsecase(repo)
    }
}