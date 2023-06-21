export const InternalErrorsMap = {
    ErrNoData: new Error("данные не найдены"),
    ErrInternalError: new Error("произошла внутреняя ошибка")
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