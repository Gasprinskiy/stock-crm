import pgPromise from "pg-promise";
import { Logger } from "../../../tools/logger/index.js";

interface PostgresInter {
    PgApp: pgPromise.IMain<{}>;
    ConnectionString: string;
    Log: Logger

    ConnectToDb(): Promise<pgPromise.IDatabase<{}>> ;
}

export class PostgresDBase implements PostgresInter {
    PgApp: pgPromise.IMain<{}>;
    ConnectionString: string;
    Log: Logger;

    constructor(conString: string) {
        this.PgApp = pgPromise();
        this.ConnectionString = conString;
        this.Log = new Logger("postgress-connection");
    }

    // ConnectToDb Подключение к базе postgress возвращение экземпляпа DB
    async ConnectToDb(): Promise<pgPromise.IDatabase<{}>> {
        this.Log.Info("Подключение к postgres...");
    
        const db = this.PgApp(this.ConnectionString)

        await db.connect()
        .then(() => {
            this.Log.Info("Подключение к postgres прошло успешно");
        })
        .catch((err: Error) => {
            this.Log.Error(`Ошибка при подключении к postgres: ${err}`,)
        })

        return db
    }
}
