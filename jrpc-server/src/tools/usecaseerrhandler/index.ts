import { InternalErrorsMap }  from "../../internal/entity/global/error/index.js";
import { Logger } from "../logger/index.js"

export const handleRepoDefaultError = async <T>(callback: Function, log: Logger, logMsg: string) : Promise< T | Error> => {
    return await callback()
    .then((response: T) => {
        return response
    })
    .catch((err: Error) => {
        if (err.name != InternalErrorsMap.ErrNoData.name) {
            log.Error(`${logMsg}, ошибка: ${err.message}`)
            return InternalErrorsMap.ErrInternalError
        }
        return err
    })
}