import { JSONRPCServer } from "json-rpc-2.0";
import pgPromise from "pg-promise";

import { ProductHandler } from './core/product.js'
import { EmployeeHandler } from "./core/employee.js";
import { Usecase } from "../../internal/usecase/index.js";


export class JRPCHandler {
    private handlers: [
        Product: ProductHandler,
        Employee: EmployeeHandler
    ]
    
    constructor(params: { 
        jrpc: JSONRPCServer<void>; 
        db: pgPromise.IDatabase<{}>; 
        ui: Usecase; 
    }){
        this.handlers = [
            new ProductHandler(params.jrpc, params.db, params.ui),
            new EmployeeHandler(params.jrpc, params.db, params.ui)
        ]
    }

    RegisterMethods() {
        this.handlers.forEach(handler => {
            handler.Init()
        })
    }
}



