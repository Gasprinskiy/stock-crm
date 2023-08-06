import axios from "axios"
import appBus from "../../shared/app-bus"

const instance = axios.create({
    baseURL: 'http://127.0.0.3:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})

instance.interceptors.request
.use(
    (request) => {
        appBus.emit('api-request-started')
        if (document.cookie) {
            request.headers.Authorization = document.cookie
        }
        return request
    }
)

instance.interceptors.response
.use(
    (response) => {
        appBus.emit('api-request-finished-successful')
        if (response.headers.authorization) {
            document.cookie = response.headers.authorization
        }
        return response.data
    },
    (err) => {  
        if (err.code === "ERR_NETWORK") {
            appBus.emit('network-error')
            return
        }
                  
        switch (err.response.status) {
            case 401: 
                appBus.emit('unauthorized-api-request')
                appBus.emit('api-request-finished-successful')
                break
            case 403:
                appBus.emit('no-acces-api-request')
                appBus.emit('api-request-finished-successful')
                break
            case 498:
                appBus.emit('session-expired')
                appBus.emit('api-request-finished-successful')
                break
            default:
                appBus.emit('api-request-finished-unsuccessful')
                throw err.response.data.message
        }
    }
)
export const handleApiPostRequest = async <T>(path: string, params?: any): Promise<T> => {
    try {
        return await instance.post(`/${path}`, {params: params})
    } catch(err: any) {
        throw err
    }
}

export const handleApiGetRequest = async <T>(path: string): Promise<T> => {
    try {
        return await instance.get(`/${path}`)
    } catch(err: any) {
        throw err
    }
}