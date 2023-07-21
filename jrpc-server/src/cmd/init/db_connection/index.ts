import pgPromise from "pg-promise";
import { Logger } from "../../../tools/logger/index.js";

export class PostgresDBase {
    private pgpApp: pgPromise.IMain<object>;
    private connectionString: string;
    private log: Logger;

    constructor(conString: string) {
        this.pgpApp = pgPromise();
        this.connectionString = conString;
        this.log = new Logger("postgress-connection");
    }

    // ConnectToDb Подключение к базе postgress возвращение экземпляпа DB
    public async Connect(): Promise<pgPromise.IDatabase<object>> {
        this.log.Info("Connecting to postgres...");
    
        const db = this.pgpApp(this.connectionString)
        
        await db.connect()
        .then(() => {
            this.log.Info("Connection to postgres was successful");
        })
        .catch((err: Error) => {
            this.log.Error(err, 'Error while connecting to postgres',)
            process.exit(1)
        })

        return db
    }
}
