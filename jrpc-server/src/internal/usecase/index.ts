import { Repository } from "../repository/index.js"
import { ProductUsecase } from "./core/product.js";
import { TemplateUsecase } from "./core/template.js";


interface UsecaseInter {
    //
    Product: ProductUsecase;
    Tempalte: TemplateUsecase;
}

export class Usecase implements UsecaseInter {
    //
    Product: ProductUsecase;
    Tempalte: TemplateUsecase;
    constructor(repo: Repository){
        //
        this.Product = new ProductUsecase(repo, this)
        this.Tempalte = new TemplateUsecase()
    }
}