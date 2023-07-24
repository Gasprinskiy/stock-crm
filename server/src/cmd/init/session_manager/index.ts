import pg from "pg";

export interface SessionManagerInter {
    Begin() : Promise<this>
    Rollback(): Promise<this>
    Commit(): Promise<this>
    // Query(sqlQuery: string, ...params: any[]): Promise<any>
    Release(): Promise<void>
    CreateTransaction(): Promise<pg.PoolClient>
}

export class SessionManager implements SessionManagerInter {
    private client: pg.PoolClient;

    constructor(client: pg.PoolClient) {
        this.client = client;
    }

    public async Begin(): Promise<this> {
        try {
            await this.client.query('BEGIN')
            return this
        } catch(err: any) {
            throw err
        }
    }

    public async Rollback(): Promise<this> {
        try {
            await this.client.query('ROLLBACK')
            return this
        } catch(err: any) {
            throw err
        }
    }

    public async Commit(): Promise<this> {
        try {
            await this.client.query('COMMIT')
            return this
        } catch(err: any) {
            throw err
        }
    }

    public async Release(): Promise<void> {
        await this.client.release()
    }

    public async CreateTransaction(): Promise<pg.PoolClient> {
        return this.client
    }
}

// export class Transaction {
//     tx: pg.PoolClient;
//     constructor(client: pg.PoolClient) {
//         this.tx = client
//     }


// }