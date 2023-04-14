import { JSONRPCServer } from "json-rpc-2.0";
import pgPromise from "pg-promise";

interface ProductInter {
    JsrpcServer: JSONRPCServer;
    DB: pgPromise.IDatabase<{}>;
}

class Product implements ProductInter {
    JsrpcServer: JSONRPCServer<void>;
    DB: pgPromise.IDatabase<{}>;
    
    constructor(jrpc: JSONRPCServer, db: pgPromise.IDatabase<{}>) {
        this.JsrpcServer = jrpc;
        this.DB = db;
    }

    Init(){

    }

}