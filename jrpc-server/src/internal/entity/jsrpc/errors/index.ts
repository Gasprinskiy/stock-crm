export interface JrpcError {
    code: number;
    name: string;
    message: string;
}

const MethodNotFound: JrpcError = {
    code: 400,
    name: "MethodNotFound",
    message: "метод не найден"
}

const InternalError: JrpcError = {
    code: 500,
    name: "InternalError",
    message: "внутреняя ошибка"
}

const ErrNoData: JrpcError = {
    code: 404,
    name: "ErrNoData",
    message: "данные не найдены"
}

const ErrWrongLoginOrPassword: JrpcError = {
    code: 401,
    name: "ErrWrongLoginOrPassword",
    message: "не верный логин или пароль"
}

export const JrpcErrorsMap = {MethodNotFound, InternalError, ErrNoData}
export const JrpcErrorsList : JrpcError[] = Object.values(JrpcErrorsMap)