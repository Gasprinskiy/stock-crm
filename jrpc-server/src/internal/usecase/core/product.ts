import { Repository } from "../../repository/index.js"

export interface ProdcuctUsecaseInter {
    repository: Repository;
}

export class ProdcuctUsecase implements ProdcuctUsecaseInter {
    repository: Repository;
    constructor(repo: Repository) {
        this.repository = repo;
    }
}