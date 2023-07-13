import { RequestHandler } from 'express';
import { SimpleJSONRPCMethod, JSONRPCServerMiddleware } from "json-rpc-2.0";


export interface ApiMethod {
    path: string;
    middleware?: RequestHandler[]; 
    handlers: RequestHandler;
}

export interface DefaultApiHandler {
    readonly methods: ApiMethod[]; 
    Init(): void;
}

export interface MethodLog {
    name: any;
    params: any;
    response_time: number;
}