import express from 'express';
import pgPromise from "pg-promise";
import { ApiMethod, DefaultApiHandler } from '../../../internal/entity/rest/entity/index.js';
import { Usecase } from "../../../internal/usecase/index.js";
import {  Request, Response } from 'express';
import { ApiMiddleware } from './middleware/index.js';
import { logRequests, responseServerError, handleApiRequest } from '../../../tools/api-err-handler/index.js';
import { Logger } from '../../../tools/logger/index.js';


export class EmployeeHandler implements DefaultApiHandler {
    private app: express.Express;
    private db: pgPromise.IDatabase<object>;
    private usecase: Usecase;
    private middleware: ApiMiddleware;
    private log: Logger;
    //
    readonly methods: ApiMethod[];
    
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
        this.log = new Logger("employee-external")

        this.methods = [
            {
                path: "auth",
                handlers: this.auth
            },
            {
                path: "createEmployee",
                middleware: [
                    this.middleware.IsAuthorized,
                ],
                handlers: this.createEmployee
            }
        ]
    }

    private async auth(req: Request, res: Response) {
        logRequests(req, res, this.log)
        
        try {
            const response = await this.db.tx((ts) => {
              return this.usecase.Employee.Auth(ts, req.body.params)
            })

            const token = this.middleware.CreateJwtToken(response)
            res.json(token)
        } catch (error: any) {
            responseServerError(res, error)
        }
    }

    private async createEmployee(req: Request, res: Response) {
        handleApiRequest((ts) => {
            return this.usecase.Employee.CreateEmployee(ts, req.body.params)
        }, this.log, this.db, {req: req, res: res})
    }

    public Init(){
        this.app.post(
            "/auth", 
            this.auth
        )

        this.app.post(
            "/create_employee",
            this.middleware.IsAuthorized,
            this.createEmployee
        )
    }
}