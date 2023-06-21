import pgPromise from "pg-promise";
import { InternalErrorsMap }  from "../../internal/entity/global/error/index.js";

// обработчик ошибок postgress репо методов
export const handleRequestError = async <T>(callback: Function) :  Promise<T | Error> => {
    return await callback()
    .then((response: T) => {
        return response
    })
    .catch((err: pgPromise.errors.QueryResultError) => {
        if (err.code == pgPromise.errors.queryResultErrorCode.noData) {
            return InternalErrorsMap.ErrNoData
        }
        return err
    })
}