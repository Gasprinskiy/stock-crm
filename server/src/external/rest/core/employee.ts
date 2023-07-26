import express from 'express';
import pgPromise from "pg-promise";
import { ApiMethod, DefaultApiHandler } from '../../../internal/entity/rest/entity/index.js';
import { Usecase } from "../../../internal/usecase/index.js";
import {  Request, Response } from 'express';
import { ApiMiddleware } from './middleware/index.js';
import { logRequests, responseServerError, handleApiRequest } from '../../../tools/api-request-handler/index.js';
import { Logger } from '../../../tools/logger/index.js';
import { AccessRight } from '../../../internal/entity/employee/constant/index.js';
import { SessionManager } from '../../../cmd/init/session_manager/index.js';


export class EmployeeHandler implements DefaultApiHandler {
    private app: express.Express;
    private db: pgPromise.IDatabase<object>;
    private usecase: Usecase;
    private middleware: ApiMiddleware;
    private log: Logger;
    private sessionManager: SessionManager;
    
    constructor(params: { 
        app: express.Express; 
        db: pgPromise.IDatabase<object>; 
        ui: Usecase; 
        middleware: ApiMiddleware;
        sessionManager: SessionManager;
    }){
        this.app = params.app;
        this.db = params.db;
        this.usecase = params.ui;
        this.middleware = params.middleware;
        this.log = new Logger("employee-external")
        this.sessionManager = params.sessionManager
    }

    public Init(){
        this.app.post(
            "/auth", 
            this.auth.bind(this)
        )

        this.app.post(
            "/create_employee",
            this.middleware.CheckAccessRight(AccessRight.full_access, AccessRight.stock_manager).bind(this.middleware),
            this.createEmployee.bind(this)
        )

        this.app.get(
            "/is_auth",
            this.middleware.IsAuthorizedWithoutNext().bind(this.middleware)
        )
    }

    private async auth(req: Request, res: Response) {
        logRequests(req, res, this.log)
        
        try {
            await this.sessionManager.Begin()

            const response = await this.usecase.Employee.Auth(this.sessionManager.client, req.body.params)

            await this.sessionManager.Commit

            const token = this.middleware.CreateJwtToken(response, res)
            res.json(token)
        } catch (err: any) {
            this.sessionManager.Rollback()
            responseServerError(res, err, this.log)
        }
    }

    private async createEmployee(req: Request, res: Response) {
        handleApiRequest((ts) => {
            return this.usecase.Employee.CreateEmployee(ts, req.body.params)
        }, this.log, this.sessionManager, {req: req, res: res})
    }
}