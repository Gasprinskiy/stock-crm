import { Repository } from "../repository/index.js"
import { ProductUsecase } from "./core/product.js";
import { TemplateUsecase } from "./core/template.js";
import { EmployeeUsecase } from "./core/employee.js"; 


export class Usecase {
    //
    Product: ProductUsecase;
    Employee: EmployeeUsecase;
    Tempalte: TemplateUsecase;
    constructor(repo: Repository){
        this.Product = new ProductUsecase(repo, this);
        this.Employee = new EmployeeUsecase(repo)
        this.Tempalte = new TemplateUsecase();
    }
}