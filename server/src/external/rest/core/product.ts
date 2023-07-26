import express from 'express';
import { Usecase } from './../../../internal/usecase/index.js';
import { DefaultApiHandler } from '../../../internal/entity/rest/entity/index.js';
import pgPromise from "pg-promise";
import { Request, Response } from 'express-serve-static-core';
import { ApiMiddleware } from './middleware/index.js';
import { handleApiRequest } from '../../../tools/api-request-handler/index.js';
import { Logger } from '../../../tools/logger/index.js';
import { AccessRight } from '../../../internal/entity/employee/constant/index.js';
import { SessionManager } from '../../../cmd/init/session_manager/index.js';

export class ProductHandler implements DefaultApiHandler {
    private app: express.Express;
    private db: pgPromise.IDatabase<object>;
    private usecase: Usecase;
    private middleware: ApiMiddleware;
    private log: Logger;
    private sessionManager: SessionManager;

    constructor(params: {
        app: express.Express, 
        db: pgPromise.IDatabase<object>,
        ui: Usecase, 
        middleware: ApiMiddleware,
        sessionManager: SessionManager
    }){
        this.app = params.app;
        this.db = params.db;
        this.usecase = params.ui;
        this.middleware = params.middleware;
        this.log = new Logger("product-external")
        this.sessionManager = params.sessionManager
    }

    public Init(){
        this.app.get(
            '/product/:id',
            this.middleware.IsAuthorized.bind(this.middleware),
            this.getProductByID.bind(this)
        )

        this.app.post(
            '/create_product',
            this.middleware.CheckAccessRight(
                AccessRight.full_access, 
                AccessRight.distributor,
            ).bind(this.middleware),
            this.createProduct.bind(this)
        )

        this.app.get(
            '/product_list',
            this.middleware.IsAuthorized.bind(this.middleware),
            this.findProductList.bind(this)
        )
    }

    private async getProductByID(req: Request, res: Response) {
        handleApiRequest((ts) => {
            return this.usecase.Product.GetProductByID(ts, Number(req.params.id))
        }, this.log, this.sessionManager, {req: req, res: res})
    }

    private async createProduct(req: Request, res: Response) {
        handleApiRequest((ts) => {
            return this.usecase.Product.CreateProduct(ts, req.body.params)
        }, this.log, this.sessionManager, {req: req, res: res})
    }

    private async findProductList(req: Request, res: Response) {
        const { login } = req.user
        handleApiRequest((ts) => {
            return this.usecase.Product.FindProductList(ts, req.body.params, login)
        }, this.log, this.sessionManager, {req: req, res: res})
    }
}