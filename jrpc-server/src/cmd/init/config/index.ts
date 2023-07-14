import YAML from "yaml";
import fs from "fs"
import path from "path";
import { fileURLToPath } from 'url';

interface PgConfig { host: string; port: number; db: string; user: string; pass: string; }
interface ServerConfig { port: number; token_key: string; }
export class Config {
    private postgres: PgConfig;
    private server: ServerConfig;

    constructor() {
        const config = this.initConfig()

        this.postgres = config.postgres
        this.server = config.server   
    }

    public PgConnectionString(): string {
        return `postgres://${this.postgres.user}:${this.postgres.pass}@${this.postgres.host}:${this.postgres.port}/${this.postgres.db}`
    }

    public ServerPort(): number {
        return this.server.port
    }

    public TokenKey() : string {        
        return this.server.token_key
    }

    private initConfig() : {postgres: PgConfig, server: ServerConfig} {
        const { env } = process
        if (!env.CONF_PATH) {
            process.exit(1)
        }
        
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filepath = path.join(__dirname, env.CONF_PATH)    
        const file = fs.readFileSync(filepath, "utf8")
        return YAML.parse(file)
    }
}