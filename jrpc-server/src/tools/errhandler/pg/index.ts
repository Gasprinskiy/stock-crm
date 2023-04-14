import pgPromise from "pg-promise";
import { GlobalErrorsMap } from "../../../internal/entity/global/index.js";

// обработчик ошибок postgress репо методов
export const handleRequestError = async <T>(callback: Function) : Promise< T | Error> => {
    try {
        return await callback()
    } catch(err: any) {        
        if (err.code == pgPromise.errors.queryResultErrorCode.noData) {
            return GlobalErrorsMap.ErrNoData
        }

        return err
    }
}