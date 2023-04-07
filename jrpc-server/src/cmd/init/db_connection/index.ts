import pgPromise from "pg-promise";

interface PostgresInter {
    PgApp: pgPromise.IMain<{}>;
    ConnectionString: string;

    ConnectToDb(): pgPromise.IDatabase<{}>;
}

export class PostgresDBase implements PostgresInter {
    PgApp: pgPromise.IMain<{}>;
    ConnectionString: string;

    constructor(conString: string) {
        this.PgApp = pgPromise();
        this.ConnectionString = conString;
    }

    // ConnectToDb Подключение к базе postgress возвращение экземпляпа DB
    ConnectToDb(): pgPromise.IDatabase<{}> {
        console.info("Подключение к postgres...");
    
        const db = this.PgApp(this.ConnectionString)

        db.connect()
        .then(() => {
            console.info("Подключение к postgres прошло успешно");
        })
        .catch((err: Error) => {
            console.error("Ошибка при подключении к postgres: ", err)
        })

        return db
    }
}
