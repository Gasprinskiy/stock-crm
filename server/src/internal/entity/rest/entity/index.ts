import { RequestHandler } from 'express';
import { AccessRight } from '../../employee/constant/index.js';


export interface ApiMethod {
    path: string;
    middleware?: RequestHandler[]; 
    handlers: RequestHandler;
}

export interface DefaultApiHandler {
    Init(): void;
}

export interface MethodLog {
    name: any;
    params: any;
    response_time: number;
}


export interface ApiUser {
    empl_id: number;
    ar_id: AccessRight;
    login: string;
}