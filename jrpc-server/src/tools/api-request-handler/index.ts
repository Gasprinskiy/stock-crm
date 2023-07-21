import { Request, Response } from "express";
import { Logger } from "../logger/index.js";
import { getDurationInMilliseconds } from "../datefunctions/index.js"; 
import { ApiErrorsList, ApiErrorsMap } from "../../internal/entity/rest/errors/index.js";
import pgPromise from "pg-promise";


export const handleApiRequest = async <T>(callback: (ts: pgPromise.ITask<object>) => Promise<T>, log: Logger, db: pgPromise.IDatabase<object>, serverParams: {req: Request; res: Response;}) : Promise<void> => {
    logRequests(serverParams.req, serverParams.res, log)
    try {
        const response = await db.tx(ts => {
            return callback(ts)
        })
        serverParams.res.json(response)
    } catch(err: any) {
        responseServerError(serverParams.res, err, log)
    }
}

export const responseServerError = (res: Response, err: Error, log: Logger): void => {
    log.Error(err)

    const apiError = ApiErrorsList.find(item => item.name === err.message)
    const responseError = apiError ? apiError : ApiErrorsMap.InternalError
    res.statusCode = responseError.code
    res.json({message: responseError.message})
}

export const logRequests = (req: Request, res: Response, log: Logger): void => {
    const start = process.hrtime()

    res.on("finish", () => {
        log.Info(`api method call: method: ${req.method}; path: ${req.url}; response time: ${getDurationInMilliseconds(start)}ms.`);
    })
}