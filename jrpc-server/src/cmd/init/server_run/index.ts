import express from "express";
import bodyParser from "body-parser";
import { JSONRPCServer, JSONRPCErrorCode } from "json-rpc-2.0";
import { Logger } from "../../../tools/logger/index.js";
import { JrpcErrorsMap } from "../../../internal/entity/jsrpc/index.js";

interface ServerInter {
    App: express.Express;
    Log: Logger;
    JRPCServer: JSONRPCServer;
    readonly Port: number;

    RunServer(): JSONRPCServer;
}

export class Server implements ServerInter {
    App: express.Express;
    JRPCServer: JSONRPCServer;
    Log: Logger;
    Port: number;
    constructor(port: number) {
        this.App = express()
        this.Log = new Logger("server-run");
        this.JRPCServer = new JSONRPCServer()
        this.Port = port
    }

    // запуск JSONRPC сервера для приема именованных методов
    RunServer(): JSONRPCServer<void> {
        this.Log.Info("Запуск JRPC сервера...")

        this.App.use(bodyParser.json());
        this.App.post("", (req, res) => {
            const jsonRPCRequest = req.body;

            this.JRPCServer.receive(jsonRPCRequest)
            .then((response) => {
                if (response) {
                    if (response.error) {
                        if (response.error.code === JSONRPCErrorCode.MethodNotFound) {
                            this.Log.Error(`метод ${req.body.method} не найден`)
                            response.error = JrpcErrorsMap.MethodNotFound
                        } else {
                            this.Log.Error(`ошибка при вызове метода ${req.body.method}: ${response.error.message}`)
                            response.error = JrpcErrorsMap.InternalError
                        }
                    }       
                    res.json(response);
                } else {
                    this.Log.Warn(`нет ответа от метода ${req.body.method}`)
                    res.sendStatus(204);
                }
            });
        });
        this.App.listen(this.Port, () => this.Log.Info(`JRPC cервер запущен на порту ${this.Port}`));

        return this.JRPCServer 
    }
}