import express from 'express';
import { DefaultApiHandler } from '../../../internal/entity/rest/entity/index.js';
import { Usecase } from "../../../internal/usecase/index.js";
import { Request, Response } from 'express';
import { ApiMiddleware } from './middleware/index.js';
import { handleApiRequest } from '../../../tools/external-generic/index.js';
import { Logger } from '../../../tools/logger/index.js';
import { SessionManager } from '../../../cmd/init/session_manager/index.js';


export class StatisticsHandler implements DefaultApiHandler {
    private app: express.Express;
    // private db: pgPromise.IDatabase<object>;
    private usecase: Usecase;
    private middleware: ApiMiddleware;
    private log: Logger;
    private sessionManager: SessionManager;
    
    constructor(params:{
        app: express.Express, 
        ui: Usecase, 
        middleware: ApiMiddleware,
        sessionManager: SessionManager;
    }){
        this.app = params.app;
        this.usecase = params.ui;
        this.middleware = params.middleware;
        this.log = new Logger("statistics-external")

        this.sessionManager = params.sessionManager
    }

    public Init(){
        this.app.get(
            "/common_statistics",
            this.middleware.IsAuthorized.bind(this.middleware), 
            this.loadCommonStatistics.bind(this)
        )
    }

    private loadCommonStatistics(req: Request, res: Response): void {
        handleApiRequest((sm) => {
            return this.usecase.Statistics.LoadCommonStatistics(sm)
        }, this.log, this.sessionManager, {req: req, res: res})
    }
}