import { InternalErrorsMap }  from "../../internal/entity/global/error/index.js";
import { Logger } from "../logger/index.js"


export const handleRepoDefaultError = async <T>(callback: () => Promise<T>, log: Logger, logMsg: string) : Promise<T> => {
    try {
        return await callback()
    } catch(err: any) {
        if (err.name != InternalErrorsMap.ErrNoData) {
            log.Error(`${logMsg}, ошибка: ${err.message}`)
            throw InternalErrorsMap.ErrInternalError
        }
        throw err
    }
}