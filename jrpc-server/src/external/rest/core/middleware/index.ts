import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { EmployeeAuthResult } from '../../../../internal/entity/employee/entity/index.js';
import { AccessRight } from '../../../../internal/entity/employee/constant/index.js';
import { Logger } from '../../../../tools/logger/index.js';
import { responseServerError } from '../../../../tools/api-request-handler/index.js';
import { InternalErrorsMap } from '../../../../internal/entity/global/error/index.js';

export class ApiMiddleware {
    private token_key: string;
    private log: Logger;
    constructor(token_key: string) {
        this.token_key = token_key;
        this.log = new Logger("middleware")
    }

    public CreateJwtToken(empl: EmployeeAuthResult, res: Response): string {
        const payload = {
            empl_id: empl.empl_id,
            ar_id: empl.ar_id,
            login: empl.login,
        }

        
        return jwt.sign(payload, this.token_key, {expiresIn: "7 days"})
    }

    public IsAuthorized(req: Request, res: Response, next: NextFunction): void {
        try {
            this.decodeToken(req)         
            return next()
        } catch(err: any) {
            responseServerError(res, err, this.log)
        }
    }

    public CheckAccessRight(...ableAccessRights: AccessRight[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            this.accessRightHandler(req, res, next, ...ableAccessRights)
        } 
    }

    public accessRightHandler(req: Request, res: Response, next: NextFunction, ...ableAccessRights: AccessRight[]) : void {  
        try {
            const decodedToked = this.decodeToken(req)
            if (!ableAccessRights.includes(decodedToked?.ar_id)) {
                throw InternalErrorsMap.ErrNoAccesRight
            }
            return next()
        } catch(err: any) {
            responseServerError(res, err, this.log)
        }
    }

    private decodeToken(req: Request): any {
        const token = req.cookies.token 
        if (token) {
            return jwt.verify(token, this.token_key)
        }
    }
}