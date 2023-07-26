import pg from "pg";

export interface SessionManagerInter {
    Begin() : Promise<void>
    Rollback(): Promise<void>
    Commit(): Promise<void>
    Release(): Promise<void>
}

export class SessionManager implements SessionManagerInter {
    public client: pg.PoolClient;

    constructor(client: pg.PoolClient) {
        this.client = client;
    }

    public async Begin(): Promise<void> {
        await this.client.query('BEGIN')
    }

    public async Rollback(): Promise<void> {
        await this.client.query('ROLLBACK')
    }

    public async Commit(): Promise<void> {
        await this.client.query('COMMIT')
    }

    public async Release(): Promise<void> {
        await this.client.release()
    }
}

// export class Transaction {
//     tx: pg.PoolClient;
//     constructor(client: pg.PoolClient) {
//         this.tx = client
//     }


// }