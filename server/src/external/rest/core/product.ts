// import { Usecase } from './../../../internal/usecase/index.js';
// // import { JsrpcMethod, DefaultJRPCHandler } from '../../../internal/entity/rest/entity/index.js';
// import { CreateProductParam, FindProductListParam,  } from './../../../internal/entity/product/params/index.js';
// import pgPromise from "pg-promise";
// import { JSONRPCParams, JSONRPCServer } from "json-rpc-2.0";
// import { Request, Response } from 'express-serve-static-core';
// import { NextFunction } from 'connect';
// import { JRPCMiddleware } from './middleware/index.js';

// export class ProductHandler implements DefaultJRPCHandler {
//     private jsrpcServer: JSONRPCServer<void>;
//     private db: pgPromise.IDatabase<object>;
//     private usecase: Usecase;
//     private middleware: JRPCMiddleware;
//     readonly methods: JsrpcMethod[];
//     constructor(
//         jrpc: JSONRPCServer<void>, 
//         db: pgPromise.IDatabase<object>,
//         ui: Usecase, 
//         middleware: JRPCMiddleware
//     ){
//         this.jsrpcServer = jrpc;
//         this.db = db;
//         this.usecase = ui;
//         this.middleware = middleware;

//         this.methods = [
//             {
//                 name: "getPoductById",
//                 handler: this.getProductByID
//             },
//             {
//                 name: "createProduct",
//                 handler: this.createProduct
//             },
//             {
//                 name: "plusMinus",
//                 handler: this.plusMinus
//             },
//             {
//                 name: "findProductList",
//                 handler: this.findProductList
//             },
//         ]
//     }

//     private async getProductByID(params: {id: number}) {
//         return await this.db.tx((ts) => {
//             return this.usecase.Product.GetProductByID(ts, params.id)
//         })
//     }

//     private async createProduct(params: CreateProductParam) {
//         return await this.db.tx((ts) => {
//             return this.usecase.Product.CreateProduct(ts, params)
//         })
//     }

//     private async findProductList(params: FindProductListParam) {
//         return await this.db.tx((ts) => {
//             return this.usecase.Product.FindProductList(ts, params)
//         })
//     }

//     private async plusMinus(params: { a: number; b: number; c: number; }): Promise<number | Error> {
//         return this.usecase.Tempalte.Sum(params.a, params.b)
//     }

//     public Init(){
//         this.methods.forEach(method => {
//             this.jsrpcServer.addMethod(method.name, method.handler.bind(this))
//         })
//     }
// }