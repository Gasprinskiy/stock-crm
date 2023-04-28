import pgPromise from "pg-promise";
import { Logger } from "../../../tools/logger/index.js";

export class PostgresDBase {
    private pgpApp: pgPromise.IMain<{}>;
    private connectionString: string;
    private log: Logger;

    constructor(conString: string) {
        this.pgpApp = pgPromise();
        this.connectionString = conString;
        this.log = new Logger("postgress-connection");
    }

    // ConnectToDb Подключение к базе postgress возвращение экземпляпа DB
    public async Connect(): Promise<pgPromise.IDatabase<{}>> {
        this.log.Info("Подключение к postgres...");
    
        const db = this.pgpApp(this.connectionString)
        
        await db.connect()
        .then(() => {
            this.log.Info("Подключение к postgres прошло успешно");
        })
        .catch((err: Error) => {
            this.log.Error(`Ошибка при подключении к postgres: ${err.message}`,)
            process.exit(1)
        })

        return db
    }
}
