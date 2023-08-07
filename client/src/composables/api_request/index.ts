import { useNotification } from "naive-ui";

export const useApiRequestHandler = <T>(callback: (args?: any) => Promise<T>, args?: any):  () => Promise<T | null> => {
    const notification = useNotification()

    return async function() : Promise<T | null> {
        try {        
            const response = await callback(args)
            return response
        } catch(err: any) {
            notification.error({
                content: err,
                duration: 3000,
                keepAliveOnHover: true,
            })
            return null
        }
    }
}