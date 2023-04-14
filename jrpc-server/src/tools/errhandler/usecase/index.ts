import { GlobalErrorsMap } from "../../../internal/entity/global/index.js"
import { Logger } from "../../logger/index.js"

export const handleRepoDefaultError = async <T>(callback: Function, log: Logger, logMsg: string) : Promise< T | Error> => {
    try {
        return await callback()
    } catch(err: any) {        
        if (err.code == GlobalErrorsMap.ErrNoData) {
            log.Error(`${logMsg}, ошибка: ${err.message}`)
            return GlobalErrorsMap.ErrNoData
        }
        return err
    }
}