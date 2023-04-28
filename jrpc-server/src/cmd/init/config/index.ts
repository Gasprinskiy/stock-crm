import YAML from "yaml";
import fs from "fs"
import path from "path";
import { fileURLToPath } from 'url';


export class Config {
    private postgres: { host: string; port: number; db: string; user: string; pass: string; };
    private server: { port: number; };

    constructor(confPath: string) {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filepath = path.join(__dirname, confPath)    
        const file = fs.readFileSync(filepath, "utf8")
        const params = YAML.parse(file)

        this.postgres = params.postgres
        this.server = params.server
    }

    public PgConnectionString(): string {
        return `postgres://${this.postgres.user}:${this.postgres.pass}@${this.postgres.host}:${this.postgres.port}/${this.postgres.db}`
    }

    public ServerPort(): number {
        return this.server.port
    }
}