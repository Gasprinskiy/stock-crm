import { Config } from './init/config/index.js'
import { PostgresDBase } from './init/db_connection/index.js'
import { Server } from './init/server_run/index.js'
import { Repository } from '../internal/repository/index.js'

import { CreateProductPayload } from '../internal/entity/product/index.js'

const { env } = process
const config = new Config(env.CONF_PATH!)

const pgConectionString = config.PgConnectionString()
const pgDbase = new PostgresDBase(pgConectionString)
const db = await pgDbase.ConnectToDb()

const serverPort = config.ServerPort()
const server = new Server(serverPort)
const jsrpcServer = await server.RunServer()

const repository = new Repository()

jsrpcServer.addMethod('getProduct', async (id: number) => {
    const resposne = await db.tx((ts) => {
        return repository.Product.getProductByID(ts, id)
    })
    return resposne
})

jsrpcServer.addMethod('createProduct', async (params: CreateProductPayload) => {
    const resposne = await db.tx((ts) => {
        return repository.Product.createProduct(ts, params)
    })
    return resposne
})

// jsrpcServer.addMethod('getLogs', async () => {
//     return await logger.GetLogs()
// })

// const connectToServer = async (db: pgPromise.IDatabase<{}>) => {
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = dirname(__filename);
//     const filepath = path.join(__dirname, "../../config.yaml")
//     const file = fs.readFileSync(filepath, "utf8")
//     const config = YAML.parse(file)
//     console.log(config);

//     db.connect()
//     .then(() => {
//         console.log("CONNTECTED TO PG");
//     })
//     .catch((err: Error) => {
//         console.error("ERR WHILE CONECTION TO PG: ", err)
//     })
// }

// app.use(bodyParser.json());
// app.post("", (req, res) => {
//     const jsonRPCRequest = req.body;

//     jsrpcServer.receive(jsonRPCRequest).then((response) => {
//         if (response) {
//           res.json(response);
//         } else {
//           res.sendStatus(204);
//         }
//     });
// });

// app.listen(3000, () => console.log("Server running on 3000 port"));
// connectToServer(db)
