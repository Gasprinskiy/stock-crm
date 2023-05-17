import pgPromise from "pg-promise";
import { JSONRPCServer } from "json-rpc-2.0";
import { JsrpcMethod, DefaultJRPCHandler } from "../../../internal/entity/jsrpc/entity/index.js";
import { Usecase } from "../../../internal/usecase/index.js";
import { AuthParams } from "../../../internal/entity/employee/params/index.js";


export class EmployeeHandler implements DefaultJRPCHandler {
    private jsrpcServer: JSONRPCServer<void>;
    private db: pgPromise.IDatabase<{}>;
    private usecase: Usecase;
    //
    readonly methods: JsrpcMethod[];
    
    constructor(
        jrpc: JSONRPCServer<void>, 
        db: pgPromise.IDatabase<{}>,
        ui: Usecase, 
    ){
        this.jsrpcServer = jrpc;
        this.db = db;
        this.usecase = ui;

        this.methods = [
            {
                name: "auth",
                handler: this.auth
            },
        ]
    }

    private async auth(params: AuthParams) {
        return await this.db.tx((ts) => {
            return this.usecase.Employee.auth(ts, params)
        })
    }

    public Init(){
        this.methods.forEach(method => {
            this.jsrpcServer.addMethod(method.name, method.handler.bind(this))
        })
    }
}