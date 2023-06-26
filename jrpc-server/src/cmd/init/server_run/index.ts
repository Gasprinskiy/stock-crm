import express from "express";
import cors from "cors"
import bodyParser from "body-parser";
import { JSONRPCServer, JSONRPCErrorCode } from "json-rpc-2.0";
import { Logger } from "../../../tools/logger/index.js";
import { JrpcErrorsMap, JrpcErrorsList, JrpcError} from "../../../internal/entity/jsrpc/errors/index.js";
import { getDurationInMilliseconds } from "../../../tools/datefunctions/index.js";

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
        this.serverLog.Info("JRPC server launch...")

        this.app.use(bodyParser.json());
        this.app.use(cors())
        this.app.post("", (req, res) => {

            this.logRequests(req, res)
            const jsonRPCRequest = req.body;
            this.jrpcServer.receive(jsonRPCRequest)
            .then((response) => {
                if (response) {
                    if (response.error) {
                        if (response.error.code === JSONRPCErrorCode.MethodNotFound) {
                            this.log.Error(`method ${req.body.method} not found`)
                            response.error = JrpcErrorsMap.MethodNotFound
                            res.sendStatus(JrpcErrorsMap.MethodNotFound.code)
                        } else {
                            this.log.Error(`error while call method ${req.body.method}: ${response.error.message}`)
                            response.error = JrpcErrorsMap.InternalError
                            res.sendStatus(JrpcErrorsMap.InternalError.code)
                        }
                    }              
                    if (response.result instanceof Error) {
                       const error = this.findErrorByName(response.result?.message)
                       response.error = error ? error : JrpcErrorsMap.InternalError
                       res.sendStatus(response.error?.code)
                       return
                    }
                    
                    res.json(response)
                } else {
                    this.log.Warn(`no response from method ${req.body.method}`)
                    res.sendStatus(204);
                }
            });
        });
        
        this.app.listen(this.port, () => this.serverLog.Info(`JRPC server running at port: ${this.port}`));

        return this.jrpcServer 
    }

    private logRequests(req: any, res: any): void {
        const start = process.hrtime()

        res.on("finish", () => {
            this.log.Info(`jrpc method call;\nmethod name: ${req.body.method}\nparams: ${JSON.stringify(req.body.params)}\nresponse time: ${getDurationInMilliseconds(start)}ms`);
        })
    }

    private findErrorByName(name: string): JrpcError | undefined {
        return JrpcErrorsList.find(item => item.name === name)
    }
}