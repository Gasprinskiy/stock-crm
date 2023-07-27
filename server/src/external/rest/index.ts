import express from 'express';

import { ProductHandler } from './core/product.js'
import { EmployeeHandler } from "./core/employee.js";
import { Usecase } from "../../internal/usecase/index.js";
import { ApiMiddleware } from "./core/middleware/index.js";
import { StockHandler } from './core/stock.js';
import { DefaultApiHandler } from '../../internal/entity/rest/entity/index.js';
import { SessionManager } from '../../cmd/init/session_manager/index.js';



export class ApiHandler {
    private handlers: DefaultApiHandler[]
    
    constructor(params: { 
        app: express.Express; 
        // db: pgPromise.IDatabase<object>; 
        ui: Usecase; 
        middleware: ApiMiddleware;
        sessionManager: SessionManager;
    }){
        this.handlers = [
            new ProductHandler(params),
            new EmployeeHandler(params),
            new StockHandler(params)
        ]
    }

    RegisterMethods() {
        this.handlers.forEach(handler => {
            handler.Init()
        })
    }
}



