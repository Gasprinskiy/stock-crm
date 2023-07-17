export interface ApiError {
    code: number;
    name: string;
    message: string;
}

const MethodNotFound: ApiError = {
    code: 400,
    name: "MethodNotFound",
    message: "метод не найден"
}

const InternalError: ApiError = {
    code: 500,
    name: "InternalError",
    message: "внутреняя ошибка"
}

const ErrNoData: ApiError = {
    code: 404,
    name: "ErrNoData",
    message: "данные не найдены"
}

const ErrWrongLoginOrPassword: ApiError = {
    code: 401,
    name: "ErrWrongLoginOrPassword",
    message: "не верный логин или пароль"
}

const ErrNotAuthorized: ApiError = {
    code: 401,
    name: "ErrNotAuthorized",
    message: "пользователь не авторизован"
}

const ErrNoAccesRight: ApiError = {
    code: 403,
    name: "ErrNoAccesRight",
    message: "нет прав доступа"
}

const EmployeeAlreadyExists: ApiError = {
    code: 409,
    name: "EmployeeAlreadyExists",
    message: "работник с такими данными уже существует"
}

export const ApiErrorsMap = {
    MethodNotFound, 
    InternalError, 
    ErrNoData, 
    ErrWrongLoginOrPassword, 
    ErrNotAuthorized, 
    ErrNoAccesRight,
    EmployeeAlreadyExists
}
export const ApiErrorsList : ApiError[] = Object.values(ApiErrorsMap)