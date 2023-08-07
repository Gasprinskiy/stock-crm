import jwt from 'jsonwebtoken';
import Cache from "node-cache"
import { NextFunction, Request, Response } from 'express';
import { EmployeeAuthResult } from '../../../../internal/entity/employee/entity/index.js';
import { AccessRight } from '../../../../internal/entity/employee/constant/index.js';
import { Logger } from '../../../../tools/logger/index.js';
import { responseServerError } from '../../../../tools/external-generic/index.js';
import { InternalErrorsMap } from '../../../../internal/entity/global/error/index.js';
import { MiddleWareErrorsMap } from '../../../../internal/entity/middleware/errors/index.js';
import { EmployeeCacheInter } from '../../../../internal/repository/redis/employee_chache.js';

export class ApiMiddleware {
    private log: Logger;

    private token_key: string;
    private session_life_seconds: number;
    private employeeChache: EmployeeCacheInter;

    constructor(params:{
        token_key: string, 
        session_life_day: number
        employeeChache: EmployeeCacheInter
    }){
        this.log = new Logger("middleware")

        this.token_key = params.token_key;
        this.session_life_seconds = 86400 * params.session_life_day
        this.employeeChache = params.employeeChache
    }

    public RemoveEmpolyeeFromCache(empl_id: number): void {
        this.employeeChache.Remove(empl_id)
    }

    public SetEmpolyeeInCache(empl_id: number): void {
        this.employeeChache.Set(empl_id, this.session_life_seconds)
    }

    public async EmployeeInChache(empl_id: number): Promise<boolean> {
        return await this.employeeChache.InChache(empl_id)
    }

    public SetJwtToken(empl: EmployeeAuthResult, res: Response): void { 
        const token = jwt.sign(empl, this.token_key, {expiresIn: this.session_life_seconds})
        if (!token) {
            throw InternalErrorsMap.ErrInternalError
        }

        res.setHeader("authorization", `Bearer ${token}`)
    }

    public async IsAuthorized(req: Request, res: Response, next: NextFunction, callNext: boolean = true): Promise<void> {        
        try {
            const decoded = await this.decodeToken(req) 
            const inCache = await this.EmployeeInChache(decoded.empl_id)
            
            if (!inCache) {                            
                throw MiddleWareErrorsMap.ErrNotAuthorized
            }

            if (!callNext) {
                res.sendStatus(200)
            }
            return next()   
        } catch(err: any) {
            responseServerError(res, err, this.log)
        }
    }

    public CheckAccessRight(...ableAccessRights: AccessRight[]): Function {
        return (req: Request, res: Response, next: NextFunction) => {
            this.checkAccessRight(req, res, next, ...ableAccessRights)
        } 
    }

    public async DecodeToken(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {
            await this.decodeToken(req)
            return next()
        } catch(err: any) {
            responseServerError(res, err, this.log)
        }
    }

    private async checkAccessRight(req: Request, res: Response, next: NextFunction, ...ableAccessRights: AccessRight[]) : Promise<void> {  
        try {
            const decodedToked = await this.decodeToken(req)
            if (decodedToked.ar_id === AccessRight.full_access) {
                return next()
            }

            if (!ableAccessRights.includes(decodedToked.ar_id)) {
                throw MiddleWareErrorsMap.ErrNoAccesRight
            }
            
            return next()
        } catch(err: any) {
            responseServerError(res, err, this.log)
        }
    }

    private async decodeToken(req: Request): Promise<any> {        
        const token = req.headers.authorization?.split(" ")[1]
                
        if (token) {
            try {
                return await jwt.verify(token, this.token_key, (err: any, decoded: any) => {
                    if (err) {
                        throw err
                    }
                    req.user = {
                        empl_id: decoded.empl_id,
                        ar_id: decoded.ar_id,
                        login: decoded.login,
                    }

                    return decoded
                })
            } catch (err: any) {      
                const { TokenExpiredError } = jwt
                if (err instanceof TokenExpiredError) {
                    throw MiddleWareErrorsMap.JwtExpired
                }
                throw err
            }
        }
        throw MiddleWareErrorsMap.ErrNotAuthorized
    }


}