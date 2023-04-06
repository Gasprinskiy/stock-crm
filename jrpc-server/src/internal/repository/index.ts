import { ProductRepoInter, ProductRepository } from "./postgres/product.js";

interface RepositoryInter {
    Product: ProductRepoInter;
}

export class Repository implements RepositoryInter {
    Product: ProductRepoInter;
    constructor(){
        this.Product = new ProductRepository();
    }
}