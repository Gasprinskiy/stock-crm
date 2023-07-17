import pgPromise from "pg-promise";
import { InternalErrorsMap }  from "../../internal/entity/global/error/index.js";

export const selectOne = async <T>(ts: pgPromise.ITask<object>, query: string, args?: any) : Promise<T> => {
    return await ts.one(query, args)
    .then((response: T) => {
        return response
    })
    .catch((err: pgPromise.errors.QueryResultError) => {
        if (err.code == pgPromise.errors.queryResultErrorCode.noData) {
            throw InternalErrorsMap.ErrNoData
        }
        throw err
    })
}

export const selectMany = async <T>(ts: pgPromise.ITask<object>, query: string, args?: any) : Promise<T[] | Error> => {
    return await ts.many(query, args)
    .then((response: T[]) => {
        return response
    })
    .catch((err: pgPromise.errors.QueryResultError) => {
        if (err.code == pgPromise.errors.queryResultErrorCode.noData) {
            throw InternalErrorsMap.ErrNoData
        }
        throw err
    })
}

