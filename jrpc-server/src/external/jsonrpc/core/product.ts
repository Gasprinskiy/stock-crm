import pgPromise from "pg-promise";
import { JSONRPCServer } from "json-rpc-2.0";
import { CreateProductPayload, Product } from "../../../internal/entity/product/index.js";
import { JsrpcMethod, DefaultJRPCHandler } from "../../../internal/entity/jsrpc/entity/index.js";
import { Usecase } from "../../../internal/usecase/index.js";

export class ProductHandler implements DefaultJRPCHandler {
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
                name: "getPoductById",
                handler: this.getProductByID
            },
            {
                name: "createProduct",
                handler: this.createProduct
            },
            {
                name: "plusMinus",
                handler: this.plusMinus
            }
        ]
    }

    private async getProductByID(params: { id: number; }) {
        return await this.db.tx((ts) => {
            return this.usecase.Product.getProductByID(ts, params.id)
        })
    }

    private async createProduct(params: CreateProductPayload) {
        return await this.db.tx((ts) => {
            return this.usecase.Product.createProduct(ts, params)
        })
    }

    private async plusMinus(params: { a: number; b: number; c: number; }): Promise<number | Error> {
        return this.usecase.Product.sumThenMinus(params.a, params.b, params.c)
    }

    public Init(){
        this.methods.forEach(method => {
            this.jsrpcServer.addMethod(method.name, method.handler.bind(this))
        })
    }
}