import express, { NextFunction, Request, Response } from "express";
import setTZ from 'set-tz';
import cors from "cors"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser"
import { Logger } from "../../../tools/logger/index.js";
import path from "path";
import { fileURLToPath } from 'url';
import { logRequests } from "../../../tools/external-generic/index.js";

export class Server {
    app: express.Express;
    private serverLog: Logger; // TO:DO no file loger
    private port: number;
    private origin: string[]

    constructor(port: number, origin: string[]) {
        this.app = express()
        this.serverLog = new Logger("server-run")
        this.port = port
        this.origin = origin
    }

    // запуск сервера
    public Run() : express.Express {
        this.serverLog.Info("Server launch...")
        this.app.use(cookieParser())
        this.app.use(bodyParser.json());
        this.app.use(cors({
            origin: this.origin,
            credentials: true,
            exposedHeaders: ["Authorization"]
        }))
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            logRequests(req, res, this.serverLog)
            next()
        })
        this.app.listen(this.port, () => this.serverLog.Info(`Server running at port: ${this.port}`));

        return this.app
    }

    // private logRequests(req: any, res: any): void {
    //     const start = process.hrtime()

    //     res.on("finish", () => {
    //         this.log.Info(`jrpc method call;\nmethod name: ${req.body.method}\nparams: ${JSON.stringify(req.body.params)}\nresponse time: ${getDurationInMilliseconds(start)}ms`);
    //     })
    // }

    // private findErrorByName(name: string): JrpcError | undefined {
    //     return JrpcErrorsList.find(item => item.name === name)
    // }
}