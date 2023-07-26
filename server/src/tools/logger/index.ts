import fs from "fs"
import { pino } from "pino";
import { timezone_date_string } from "../datefunctions/index.js";

export type LoggerFields = {[key: string]: any}

const { env } = process

interface LoggerInter {
    Info(message: string): void;
    Debug(message: string): void;
    Warn(message: string): void;
    Error(err: any): void;
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
    private noFileLog: boolean;
    private optinalFileds: string;

    constructor(prefix: string, noFileLog = false) {  
        this.Path = env.LOG_PATH!;
        // this.Path = "./log.txt"
        this.Prefix = prefix;
        this.CustomLog = pino();
        this.optinalFileds = ''

        this.noFileLog = noFileLog;
    }

    public WithFields(fields: LoggerFields): this {
        this.optinalFileds = ""
        console.log("fileds", fields);
        
        Object.keys(fields).forEach(key => {
            this.optinalFileds += `${key}: ${fields[key]} `
        })
        
        return this
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

    public Error(err: any, optionalText?: string): void {
        const log = this.errorLogWithPrefix(err.message, err.stack, optionalText)
        this.CustomLog.error(log)
        this.writeToFileLog(logTypeMap[logType.error], log)
    }

    public async GetLogs() {
        const data = await fs.readFileSync(this.Path, {encoding: "utf-8"})
        return data
    }

    private logWithPrefix(message: string) {
        return `[${this.Prefix}] ${message} ${this.optinalFileds}`
    }

    private errorLogWithPrefix(message: string, stack?: string, optionalText?: string) : string {
        const optionalTextString = optionalText ? ` ${optionalText}: ` : ''
        const stackTextString = stack ? ` ${stack}` : ''
        const messageText = optionalText ? `${message}` : `${message}`
        const fileds = this.optinalFileds.length > 0 ? `${this.optinalFileds};` : ''

        return `[${this.Prefix}] ${optionalTextString}${messageText}; ${fileds}\n${stackTextString}`
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