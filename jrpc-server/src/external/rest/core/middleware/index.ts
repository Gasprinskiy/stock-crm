import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { EmployeeAuthResult } from '../../../../internal/entity/employee/entity/index.js';
import { ApiErrorsMap } from '../../../../internal/entity/rest/errors/index.js';
import { AccessRight } from '../../../../internal/entity/employee/constant/index.js';
import { decode } from 'punycode';
import { Logger } from '../../../../tools/logger/index.js';
import { DecodedToken } from '../../../../internal/entity/rest/entity/index.js';
import { responseServerError } from '../../../../tools/api-err-handler/index.js';
// import { JrpcErrorsMap } from '../../../../internal/entity/rest/errors/index.js';

export class ApiMiddleware {
    private token_key: string;
    private log: Logger;
    constructor(token_key: string) {
        this.token_key = token_key;
        this.log = new Logger("middleware")
    }

    public CreateJwtToken(empl: EmployeeAuthResult): string {
        const payload = {
            ar_id: empl.ar_id,
            login: empl.login,
        }
        return jwt.sign(payload, this.token_key)
    }

    public IsAuthorized(req: Request, res: Response, next: NextFunction): void {
        try {
            this.decodeToken(req)         
            return next()
        } catch(err: any) {
            this.log.Error(err.message)
            responseServerError(res, err)
        }
    }

    public CheckAccessRight(...ableAccessRights: AccessRight[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            this.accessRight(req, res, next, ...ableAccessRights)
        } 
    }

    public accessRight(req: Request, res: Response, next: NextFunction, ...ableAccessRights: AccessRight[]) : void {  
        try {
            const decodedToked = this.decodeToken(req)
            if (!ableAccessRights.includes(decodedToked?.ar_id)) {
                throw ApiErrorsMap.ErrNoAccesRight
            }
            return next()
        } catch(err: any) {
            this.log.Error(err.message)
            responseServerError(res, err)
        }
    }

    private decodeToken(req: Request): any {
        const token = req.headers.authorization?.split(' ')[1]  
        if (token) {
            return jwt.verify(token, this.token_key)
        }
    }
}