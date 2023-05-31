
export const removeArrayDublicateByKey = <T>(typeKey: keyof T, src: T[]): T[] => {
    const uniqueArray : T[] = []
    const keysMap = new Set(src.map(item => item[typeKey]))

    Array.from(keysMap).forEach(key => {
        const item = src.find(item => item[typeKey] === key)
        if (item) {
            uniqueArray.push(item)
        }
    })

    return uniqueArray
}