import pgPromise from "pg-promise";

// ConnectToPostgress Подключение к базе postgress возвращение экземпляпа DB
export const ConnectToPostgress = (pg: pgPromise.IMain<{}>, conString: string) : pgPromise.IDatabase<{}>  => {
    console.info("Подключение к postgres...");
    
    const db = pg(conString)

    db.connect()
    .then(() => {
        console.info("Подключение к postgres прошло успешно");
    })
    .catch((err: Error) => {
        console.error("Ошибка при подключении к postgres: ", err)
    })

    return db
}