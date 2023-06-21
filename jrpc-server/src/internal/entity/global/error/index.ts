export const InternalErrorsMap = {
    ErrNoData: new Error("ErrNoData"),
    ErrInternalError: new Error("ErrInternalError")
}

export const GlobalResponseErrors = {
    ErrNoData: {
        name: "ErrNoData",
        message: "данные не найдены"
    },
    ErrInternalError: {
        name: "ErrInternalError",
        message: "произошла внутреняя ошибка"
    },
}