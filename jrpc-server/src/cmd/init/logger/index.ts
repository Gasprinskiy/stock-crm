import path from "path";
import fs from "fs"
import { pino } from "pino";
import { fileURLToPath } from "url";

interface LoggerInter {
    readonly Target: string;
    Log: pino.Logger;

    Info(message: string): void;
    // Debug(message: string): void;
    // Warn(message: string): void;
    // Error(message: string): void;
}

export class Logger implements LoggerInter {
    Target: string;
    Log: pino.Logger<pino.LoggerOptions>;
    constructor(logPath: string) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const target = path.join(__dirname, logPath)  
        this.Target = target;
        this.Log = pino()
    }

    Info(message: string): void {
        this.Log.info(message)
    
        fs.open(`${this.Target}/info.json`, "r+", (err) => {
            if (err) {
                console.log(err);
                return
            } 
            console.log("файл создан");
            const logData = fs.readFileSync(`${this.Target}/info.json`, "utf-8")
            const parsedLog = JSON.parse(logData)
            parsedLog.push({
                message: message,
                time: Date.now().toLocaleString()
            })

            const data = JSON.stringify(parsedLog);
            // Пишем в файл
            fs.writeFileSync(`${this.Target}/info.json`, data);
        })
        
        // if (this.fileExist("info.json")) {
        //     const logData = fs.readFileSync(`${this.Target}/"info.json"`, "utf-8")
        //     const parsedLog = JSON.parse(logData)
        //     parsedLog.push({
        //         message: message,
        //         time: Date.now().toLocaleString()
        //     })

        //     const data = JSON.stringify(parsedLog);
        //     // Пишем в файл
        //     fs.writeFileSync(`${this.Target}/"info.json"`, data);
        // }
    }
    
    private fileExist(fileName: string): boolean {
        let exist = false
        console.log("path to file", `${this.Target}/${fileName}`);
        
        fs.access(`${this.Target}/${fileName}`, fs.constants.F_OK, function(err){
            if (err) {
                return
            }
            exist = true
        })
        return exist
    }
}