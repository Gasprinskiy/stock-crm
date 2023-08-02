import express from "express";
import setTZ from 'set-tz';
import cors from "cors"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser"
import { Logger } from "../../../tools/logger/index.js";
import path from "path";
import { fileURLToPath } from 'url';

export class Server {
    app: express.Express;
    private serverLog: Logger; // TO:DO no file loger
    private port: number;

    constructor(port: number) {
        this.app = express()
        this.serverLog = new Logger("server-run")
        this.port = port
    }

    // запуск сервера
    public Run() : express.Express {
        this.serverLog.Info("Server launch...")
        this.app.use(bodyParser.json());
        this.app.use(cors({
            origin: [
                "http://127.0.0.3"
            ],
            credentials: true,
        }))
        this.app.use(cookieParser())

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