import express from "express";
import bodyParser from "body-parser";
import { JSONRPCServer, JSONRPCErrorCode } from "json-rpc-2.0";
import { Logger } from "../../../tools/logger/index.js";
import JrpcErrorsMap  from "../../../internal/entity/jsrpc/errors/index.js";

export class Server  {
    private app: express.Express;
    private jrpcServer: JSONRPCServer;
    private serverLog: Logger; // TO:DO no file loger
    private log: Logger; 
    private port: number;

    constructor(port: number) {
        this.app = express()
        this.jrpcServer = new JSONRPCServer()
        this.log = new Logger("jrpc-handler");
        this.serverLog = new Logger("jrpc-server-run")
        this.port = port
    }

    // запуск JSONRPC сервера для приема именованных методов
    public Run(): JSONRPCServer<void> {
        this.serverLog.Info("Запуск JRPC сервера...")

        this.app.use(bodyParser.json());
        this.app.post("", (req, res) => {
            const jsonRPCRequest = req.body;

            this.jrpcServer.receive(jsonRPCRequest)
            .then((response) => {
                if (response) {
                    if (response.error) {
                        if (response.error.code === JSONRPCErrorCode.MethodNotFound) {
                            this.log.Error(`метод ${req.body.method} не найден`)
                            response.error = JrpcErrorsMap.MethodNotFound
                        } else {
                            this.log.Error(`ошибка при вызове метода ${req.body.method}: ${response.error.message}`)
                            response.error = JrpcErrorsMap.InternalError
                        }
                    }       
                    res.json(response);
                } else {
                    this.log.Warn(`нет ответа от метода ${req.body.method}`)
                    res.sendStatus(204);
                }
            });
        });
        
        this.app.listen(this.port, () => this.serverLog.Info(`JRPC cервер запущен на порту ${this.port}`));

        return this.jrpcServer 
    }
}