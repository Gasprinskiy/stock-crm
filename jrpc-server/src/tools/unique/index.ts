
export const removeArrayObjectDublicateByKey = <T>(typeKey: keyof T, src: T[]): T[] => {
    const uniqueArray : T[] = []
    const keysMap = new Set(src.map(item => item[typeKey]))

    Array.from(keysMap).forEach(key => {
        uniqueArray.push(src.find(item => item[typeKey] === key)!)
    })

    return uniqueArray
}

export const removeArrayDublicate = <T>(src: T[]) : T[] => {
    return Array.from(new Set(src))
}