import fs from "fs"
import { pino } from "pino";
import { pinoHttp, HttpLogger } from "pino-http"; 
import { timezone_date_string } from "../datefunctions/index.js";


const { env } = process

interface LoggerInter {
    Info(message: string): void;
    Debug(message: string): void;
    Warn(message: string): void;
    Error(message: string): void;
}

enum logType {info, debug, warn, error}

interface logTypeMap {
    [logType.info]: string;
    [logType.debug]: string;
    [logType.warn]: string;
    [logType.error]: string;
}

const logTypeMap : logTypeMap  = {
    0: "INFO",
    1: "DEBUG",
    2: "WARN",
    3: "ERROR"
}

export class Logger implements LoggerInter {
    private Path: string;
    private Prefix: string;
    private CustomLog: pino.Logger<pino.LoggerOptions>;
    private HttpLogger: HttpLogger;
    private noFileLog: boolean;

    constructor(prefix: string, noFileLog = false) {  
        this.Path = env.LOG_PATH!;
        // this.Path = "./log.txt"
        this.Prefix = prefix;
        this.CustomLog = pino();
        this.HttpLogger = pinoHttp()

        this.noFileLog = noFileLog;
    }

    public Info(message: string): void {
        const log = this.logWithPrefix(message)
        this.CustomLog.info(log)
        this.writeToFileLog(logTypeMap[logType.info], log)
    }

    public Debug(message: string): void {
        const log = this.logWithPrefix(message)
        this.CustomLog.debug(log)
        this.writeToFileLog(logTypeMap[logType.debug], log)
    }

    public Warn(message: string): void {
        const log = this.logWithPrefix(message)
        this.CustomLog.warn(log)
        this.writeToFileLog(logTypeMap[logType.warn], log)
    }

    public Error(message: string): void {
        const log = this.logWithPrefix(message)
        this.CustomLog.error(log)
        this.writeToFileLog(logTypeMap[logType.error], log)
    }

    async GetLogs() {
        const data = await fs.readFileSync(this.Path, {encoding: "utf-8"})
        return data
    }

    private logWithPrefix(message: string) {
        return `[${this.Prefix}] ${message}`
    }

    private async writeToFileLog(type: string, message: string) {
        if (!this.noFileLog) {
            const logTimeString = timezone_date_string.replace("/", ".").replace(", ", " ")
            const log = `type: ${type}, message: ${message}, time: ${logTimeString}\r\n`
            fs.appendFileSync(this.Path, log)
        }
    }
    
    
 
    // private rewriteLogFile(type: logType, message: string) { 
    //     const newlog = this.newLog(type, message)
    //     const data = fs.readFileSync(this.Path, {encoding: "utf-8"})
        
    //     if (data.length === 0) {
    //         const emptyLog : Log[] = []
    //         return this.writeToFileLog(emptyLog, newlog)
    //     }
    //     return this.writeToFileLog(JSON.parse(data), newlog)
    // }

    // private writeToFileLog(data: Log[], newLog: Log) {
    //     data.push(newLog)
    //     console.log(data);
                      
    //     const newData = JSON.stringify(data);
    //     fs.writeFileSync(this.Path, newData);
    // }
}