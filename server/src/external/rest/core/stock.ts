import express from 'express';
import pgPromise from "pg-promise";
import { DefaultApiHandler } from '../../../internal/entity/rest/entity/index.js';
import { Usecase } from "../../../internal/usecase/index.js";
import { Request, Response } from 'express';
import { ApiMiddleware } from './middleware/index.js';
import { handleApiRequest } from '../../../tools/api-request-handler/index.js';
import { Logger } from '../../../tools/logger/index.js';


export class StockHandler implements DefaultApiHandler {
    private app: express.Express;
    private db: pgPromise.IDatabase<object>;
    private usecase: Usecase;
    private middleware: ApiMiddleware;
    private log: Logger;
    
    constructor(
        app: express.Express, 
        db: pgPromise.IDatabase<object>,
        ui: Usecase, 
        middleware: ApiMiddleware
    ){
        this.app = app;
        this.db = db;
        this.usecase = ui;
        this.middleware = middleware;
        this.log = new Logger("stock-external")
    }

    public Init(){
        this.app.get(
            "/load_stocks",
            this.middleware.IsAuthorized.bind(this.middleware), 
            this.loadStocks.bind(this)
        )
    }

    private async loadStocks(req: Request, res: Response) {
        const { empl_id } = req.user
        handleApiRequest((ts) => {
            return this.usecase.Stock.FindStockListByEmployeeID(ts, empl_id)
        }, this.log, this.db, {req: req, res: res})
    }
}