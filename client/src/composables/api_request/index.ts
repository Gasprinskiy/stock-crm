import { useNotification } from "naive-ui";

export const useApiRequestHandler = <T>(callback: (args?: any) => Promise<T>):  (args?: any) => Promise<T | null> => {
    const notification = useNotification()

    return async function(args?: any) : Promise<T | null> {
        try {  
            return await callback(args)
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