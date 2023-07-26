import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { EmployeeAuthResult } from '../../../../internal/entity/employee/entity/index.js';
import { AccessRight } from '../../../../internal/entity/employee/constant/index.js';
import { Logger } from '../../../../tools/logger/index.js';
import { logRequests, responseServerError } from '../../../../tools/external-generic/index.js';
import { InternalErrorsMap } from '../../../../internal/entity/global/error/index.js';
import { ApiUser } from '../../../../internal/entity/rest/entity/index.js';
import { MiddleWareErrorsMap } from '../../../../internal/entity/middleware/errors/index.js';

export class ApiMiddleware {
    private token_key: string;
    private log: Logger;
    constructor(token_key: string) {
        this.token_key = token_key;
        this.log = new Logger("middleware")
    }

    public CreateJwtToken(empl: EmployeeAuthResult, res: Response): string {  
        const payload : ApiUser = {
            empl_id: empl.empl_id,
            ar_id: empl.ar_id,
            login: empl.login,
        }
        
        const token = jwt.sign(payload, this.token_key, {expiresIn: "7 days"})
        res.cookie('token', token)
        return token
    }

    public IsAuthorizedWithoutNext() {
        return (req: Request, res: Response, next: NextFunction) => {
            logRequests(req, res, this.log)
            this.IsAuthorized(req, res, next, false)
        }
    }

    public IsAuthorized(req: Request, res: Response, next: NextFunction, callNext: boolean = true): void {        
        try {
            const decoded = this.decodeToken(req)            
            req.user = {
                empl_id: decoded.empl_id,
                ar_id: decoded.ar_id,
                login: decoded.login
            }
            
            if (!callNext) {
                res.statusCode = 200
                res.json({message: "authorized"})
            }

            return next()   
        } catch(err: any) {
            responseServerError(res, err, this.log)
        }
    }

    public CheckAccessRight(...ableAccessRights: AccessRight[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            this.checkAccessRight(req, res, next, ...ableAccessRights)
        } 
    }

    private checkAccessRight(req: Request, res: Response, next: NextFunction, ...ableAccessRights: AccessRight[]) : void {  
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
            try {
                return jwt.verify(token, this.token_key)
            } catch (err: any) {      
                const { TokenExpiredError } = jwt
                if (err instanceof TokenExpiredError) {
                    throw MiddleWareErrorsMap.JwtExpired
                }
                throw err
            }
        }
        throw new Error('Пошел нахуй мудак')
    }
}