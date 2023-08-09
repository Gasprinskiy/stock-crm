import { InternalErrorsMap }  from "../../internal/entity/global/error/index.js";
import pg from "pg";

export const select = async <T>(sm: pg.PoolClient, query: string, args?: any[]) : Promise<T[]> => {
    try {
        const response = await sm.query(query, args)        
        if (response.rows.length <= 0) {
            throw InternalErrorsMap.ErrNoData
        }

        return response.rows
    } catch(err: any) {
        throw err
    }
}

export const get = async <T>(sm: pg.PoolClient, query: string, args?: any[]) : Promise<T> => {
    try {
        const response = await sm.query(query, args)
        if (response.rows.length <= 0) {
            throw InternalErrorsMap.ErrNoData
        }

        return response.rows[0]
    } catch(err: any) {
        throw err
    }
}

export const getReturnField = async <T>(sm: pg.PoolClient, query: string, field: keyof pg.QueryResultRow, args?: any[]) : Promise<T> => {
    try {
        const response = await sm.query(query, args)
        if (response.rows.length <= 0) {
            throw InternalErrorsMap.ErrNoData
        }

        return response.rows[0][field]
    } catch(err: any) {
        throw err
    }
}

export const insert = async <T>(sm: pg.PoolClient, query: string, returnResult: boolean = false, args?: any[]) : Promise<T|any> => {
    try {
        const response = await sm.query(query, args)
        if (returnResult) {
            return response.rows[0]
        }
    } catch(err: any) {
        throw err
    }
}

export const insertReturnID = async (sm: pg.PoolClient, query: string, returnKey: keyof pg.QueryResultRow, args?: any[]) : Promise<number> => {
    try {
        const response = await sm.query(query, args)
        return response.rows[0][returnKey]
    } catch(err: any) {
        throw err
    }
}
