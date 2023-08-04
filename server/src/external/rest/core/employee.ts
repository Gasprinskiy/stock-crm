import express, { NextFunction } from 'express';

import { ApiMethod, DefaultApiHandler } from '../../../internal/entity/rest/entity/index.js';
import { Usecase } from "../../../internal/usecase/index.js";
import {  Request, Response } from 'express';
import { ApiMiddleware } from './middleware/index.js';
import { responseServerError, handleApiRequest } from '../../../tools/external-generic/index.js';
import { Logger } from '../../../tools/logger/index.js';
import { AccessRight } from '../../../internal/entity/employee/constant/index.js';
import { SessionManager } from '../../../cmd/init/session_manager/index.js';


export class EmployeeHandler implements DefaultApiHandler {
    private app: express.Express;
    // private db: pgPromise.IDatabase<object>;
    private usecase: Usecase;
    private middleware: ApiMiddleware;
    private log: Logger;
    private sessionManager: SessionManager;
    
    constructor(params: { 
        app: express.Express; 
        // db: pgPromise.IDatabase<object>; 
        ui: Usecase; 
        middleware: ApiMiddleware;
        sessionManager: SessionManager;
    }){
        this.app = params.app;
        // this.db = params.db;
        this.usecase = params.ui;
        this.middleware = params.middleware;
        this.log = new Logger("employee-external")
        this.sessionManager = params.sessionManager
    }

    public Init(){
        this.app.post(
            "/log_in", 
            this.logIn.bind(this)
        )

        this.app.post(
            "/log_out", 
            this.middleware.ResetCoockie.bind(this.middleware),
            this.middleware.DecodeToken.bind(this.middleware),
            this.logOut.bind(this)

        )

        this.app.post(
            "/create_employee",
            this.middleware.CheckAccessRight(AccessRight.stock_manager).bind(this.middleware),
            this.createEmployee.bind(this)
        )

        this.app.get(
            "/is_auth",
            this.middleware.IsAuthorizedWithoutNext().bind(this.middleware)
        )
    }

    private async logIn(req: Request, res: Response) : Promise<void> { 
        try {
            const response = await this.usecase.Employee.LogIn(this.sessionManager.client, req.body.params)
            await this.middleware.SetJwtToken(response, req, res)
            await this.middleware.SetEmpolyeeInCache(response.empl_id)
            res.json(response)
        } catch (err: any) {
            responseServerError(res, err, this.log)
        }
    }

    private logOut(req: Request, res: Response) {
        this.middleware.RemoveEmpolyeeFromCache(req.user.empl_id)
        res.sendStatus(200)
    }

    private createEmployee(req: Request, res: Response): void {
        handleApiRequest((ts) => {
            return this.usecase.Employee.CreateEmployee(ts, req.body.params)
        }, this.log, this.sessionManager, {req: req, res: res})
    }
}