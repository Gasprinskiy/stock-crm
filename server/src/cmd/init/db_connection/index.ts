import pgPromise from "pg-promise";
import pg from "pg";
import { Logger } from "../../../tools/logger/index.js";

export class PostgresDBase {
    private pgpApp: pgPromise.IMain<object>;
    private connectionString: string;
    private log: Logger;
    // new client
    private client: pg.Pool;

    constructor(connectionString: string) {
        this.pgpApp = pgPromise();
        this.connectionString = connectionString;
        this.log = new Logger("postgress-connection");

        this.client = new pg.Pool({
            connectionString
        })
    }

    public async Connect(): Promise<pg.PoolClient> {
        this.log.Info("Connecting to postgres...");

        try {
            const client = await this.client.connect()
            this.log.Info("Connection to postgres was successful");
            return client
        } catch(err: any) {
            this.log.Error(err, 'Error while connecting to postgres')
            this.client.end()
            process.exit(1)
        }
    }
}
