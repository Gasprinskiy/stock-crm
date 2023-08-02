import axios from "axios"


const instance = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const handleApiPostRequest = async <T>(path: string, params?: any): Promise<T> => {
    try {
        const response = await instance.post(`/${path}`, {params: params})
        console.log(response);
        
        return response.data
    } catch(err: any) {
        throw err.response.data.message
    }
}

export const handleApiGetRequest = async <T>(path: string): Promise<T> => {
    try {
        return await instance.get(`/${path}`)
    } catch(err: any) {
        throw err.response.data.message
    }
}