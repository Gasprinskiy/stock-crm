import pgPromise from "pg-promise";


export const proccesError = async <T>(callback: Function) : Promise< T | Error> => {
    try {
        return await callback()
    } catch(err: any) {
        console.error(err);
        
        if (err.code == pgPromise.errors.queryResultErrorCode.noData) {
            return {
                message: "данные не найдены",
                name: "ErrNoData"
            }
        }

        return {
            message: "произошла внутреняя ошибка",
            name: "ErrInternalError"
        }
    }
}