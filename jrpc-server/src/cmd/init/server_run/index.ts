import { JSONRPCServer } from "json-rpc-2.0";
// import { Express } from "express";
import express from "express";
import bodyParser from "body-parser";

interface ServerInter {
    App: express.Express;
    readonly Port: number;
    JRPCServer: JSONRPCServer;

    RunServer(): JSONRPCServer;
}

export class Server implements ServerInter {
    App: express.Express;
    Port: number;
    JRPCServer: JSONRPCServer;

    constructor(port: number) {
        this.App = express()
        this.Port = port
        this.JRPCServer = new JSONRPCServer()
    }

    RunServer(): JSONRPCServer<void> {
        console.info("Запуск JRPC сервера...")

        this.App.use(bodyParser.json());
        this.App.post("", (req, res) => {
            const jsonRPCRequest = req.body;

            this.JRPCServer.receive(jsonRPCRequest)
            .then((response) => {
                if (response) {
                    res.json(response);
                } else {
                    res.sendStatus(204);
                }
            });
        });
        this.App.listen(this.Port, () => console.info(`JRPC cервер запущен на порту ${this.Port}`));

        return this.JRPCServer 
    }
}