import { JSONRPCServer } from "json-rpc-2.0";
import pgPromise from "pg-promise";

interface JRPC {
    JsrpcServer: JSONRPCServer;
    DB: pgPromise.IDatabase<{}>;
    
    Core: {
        
    }
}



