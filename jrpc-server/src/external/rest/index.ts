import express from 'express';
import pgPromise from "pg-promise";
// import { ProductHandler } from './core/product.js'
import { EmployeeHandler } from "./core/employee.js";
import { Usecase } from "../../internal/usecase/index.js";
import { ApiMiddleware } from "./core/middleware/index.js";


export class ApiHandler {
    private handlers: [
        // Product: ProductHandler,
        Employee: EmployeeHandler
    ]
    
    constructor(params: { 
        app: express.Express; 
        db: pgPromise.IDatabase<object>; 
        ui: Usecase; 
        middleware: ApiMiddleware;
    }){
        this.handlers = [
            // new ProductHandler(params.app, params.db, params.ui, params.middleware),
            new EmployeeHandler(params.app, params.db, params.ui, params.middleware)
        ]
    }

    RegisterMethods() {
        this.handlers.forEach(handler => {
            handler.Init()
        })
    }
}



