import jwt from 'jsonwebtoken';
import Cache from "node-cache"
import { NextFunction, Request, Response } from 'express';
import { EmployeeAuthResult } from '../../../../internal/entity/employee/entity/index.js';
import { AccessRight } from '../../../../internal/entity/employee/constant/index.js';
import { Logger } from '../../../../tools/logger/index.js';
import { responseServerError } from '../../../../tools/external-generic/index.js';
import { InternalErrorsMap } from '../../../../internal/entity/global/error/index.js';
import { ApiUser } from '../../../../internal/entity/rest/entity/index.js';
import { MiddleWareErrorsMap } from '../../../../internal/entity/middleware/errors/index.js';

export class ApiMiddleware {
    private log: Logger;

    private token_key: string;
    private session_life_day: number;
    private session_life_seconds: number;
    private employeeChache: Cache;

    constructor(token_key: string, session_life_day: number) {
        this.log = new Logger("middleware")

        this.token_key = token_key;
        this.session_life_day = session_life_day;
        this.session_life_seconds = 86400 * session_life_day
        this.employeeChache = new Cache({
            stdTTL: this.session_life_seconds,
            checkperiod: 120,
            useClones: false
        })
    }

    public RemoveEmpolyeeFromCache(empl_id: number): void {
        this.employeeChache.del(empl_id)
    }

    public SetEmpolyeeInCache(empl_id: number): void {
        this.employeeChache.set(empl_id, true)
    }

    public EmployeeInChache(empl_id: number): boolean | undefined {
        return this.employeeChache.get(empl_id)
    }

    public SetJwtToken(empl: EmployeeAuthResult, req: Request, res: Response): void {  
        const payload : ApiUser = {
            empl_id: empl.empl_id,
            ar_id: empl.ar_id,
            login: empl.login,
        }
 
        const token = jwt.sign(payload, this.token_key, {expiresIn: this.session_life_seconds})
        if (!token) {
            throw InternalErrorsMap.ErrInternalError
        }

        const now = new Date()
        res.cookie('token', token, {
            sameSite: 'none', 
            secure: true,
            httpOnly: true,
            expires: new Date(now.setDate(now.getDay() + this.session_life_day)),
        })
    }

    public ResetCoockie(req: Request, res: Response, next: NextFunction): void  {
        console.log("FUCK");
        
        const token = req.cookies.token
        const now = new Date()
        res.cookie('token', token, 
            {
                sameSite: 'none', 
                secure: true,
                httpOnly: true,
                expires: new Date(now.setDate(now.getDate() -1))
            }
        )
        return next()
    }

    public IsAuthorizedWithoutNext(): Function {
        return (req: Request, res: Response, next: NextFunction) => {
            this.IsAuthorized(req, res, next, false)
        }
    }

    public async IsAuthorized(req: Request, res: Response, next: NextFunction, callNext: boolean = true): Promise<void> {        
        try {
            const decoded = await this.decodeToken(req)
            if (!this.EmployeeInChache(decoded.empl_id)) {
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
                throw InternalErrorsMap.ErrNoAccesRight
            }
            
            return next()
        } catch(err: any) {
            responseServerError(res, err, this.log)
        }
    }

    private async decodeToken(req: Request): Promise<any> {
        const token = req.cookies.token
         
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