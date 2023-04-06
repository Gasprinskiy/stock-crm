import express from "express";
import pgPromise from "pg-promise";
import { ProductPayload } from "../internal/entity/product/index.js";
import { ProductRepoImpl } from "../internal/repository/postgres/product.js";
import { RunServer } from "./init/server_run/index.js";
import { ConnectToPostgress } from "./init/db_connection/index.js";
import { Config } from "./init/config/index.js";

const app = express();
const pgp = pgPromise();

const config = new Config();

const pgConectionString = config.PgConnectionString();
const db = ConnectToPostgress(pgp, pgConectionString);

const serverPort = config.ServerPort();
const jsrpcServer = RunServer(app, serverPort);

const productRepo = new ProductRepoImpl()

jsrpcServer.addMethod("getProduct", async ({ id }: {id: number}) => {
    const resposne = await db.tx(ts => {
        return productRepo.getProductByID(ts, id)
    })
    return resposne
});

jsrpcServer.addMethod("createProduct", async (params: ProductPayload) => {
    const resposne = await db.tx(ts => {
        return productRepo.createProduct(ts, params)
    })
    return resposne
})


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