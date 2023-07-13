import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { EmployeeAuthResult } from '../../../../internal/entity/employee/entity/index.js';
import { ApiErrorsMap } from '../../../../internal/entity/rest/errors/index.js';
// import { JrpcErrorsMap } from '../../../../internal/entity/rest/errors/index.js';

export class ApiMiddleware {
    private token_key: string;
    constructor(token_key: string) {
        this.token_key = token_key;
    }

    public CreateJwtToken(empl: EmployeeAuthResult): string {
        console.log("secret_in_method: ",this.token_key);
        const payload = {
            ar_id: empl.ar_id,
            login: empl.login,
        }
        return jwt.sign(payload, this.token_key)
    }

    public IsAuthorized(req: Request, res: Response, next: NextFunction): void {
        try {
            const token = req.headers.authorization?.split(' ')[1]            

            if (token) {
                const decode = jwt.verify(token, this.token_key)
                if (decode) {
                    return next()
                }
            }

            res.statusCode = ApiErrorsMap.ErrNotAuthorized.code
            res.json({message: ApiErrorsMap.ErrNotAuthorized.message}) 
        } catch(err) {
            res.statusCode = ApiErrorsMap.ErrNotAuthorized.code
            res.json({message: ApiErrorsMap.ErrNotAuthorized.message})
        }
    }
}