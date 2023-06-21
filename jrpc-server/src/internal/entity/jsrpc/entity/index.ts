import { SimpleJSONRPCMethod } from "json-rpc-2.0";

export interface JsrpcMethod {
    name: string;
    handler: SimpleJSONRPCMethod;
}

export interface DefaultJRPCHandler {
    readonly methods: JsrpcMethod[]; 
    Init(): void;
}

export interface MethodLog {
    name: any;
    params: any;
    response_time: number;
}