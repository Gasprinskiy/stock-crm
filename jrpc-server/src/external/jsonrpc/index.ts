import { JSONRPCServer } from "json-rpc-2.0";
import pgPromise from "pg-promise";

import { ProductHandler } from './core/product.js'
import { Usecase } from "../../internal/usecase/index.js";


export class JRPCHandler {
    private handlers: [
        ProductHandler: ProductHandler
    ]
    
    constructor(params: { 
        jrpc: JSONRPCServer<void>; 
        db: pgPromise.IDatabase<{}>; 
        ui: Usecase; 
    }){
        this.handlers = [
            new ProductHandler(params.jrpc, params.db, params.ui)
        ]
    }

    RegisterMethods() {
        this.handlers.forEach(handler => {
            handler.Init()
        })
    }
}



