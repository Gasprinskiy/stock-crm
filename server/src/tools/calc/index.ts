import { LoadParams } from "../../internal/entity/global/entity/index.js"

export const caclLoadParamsOffset = (p: LoadParams) : number => {
    p.offset -= 1
    return p.limit * p.offset
}