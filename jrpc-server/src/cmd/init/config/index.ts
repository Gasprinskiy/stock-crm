import YAML from "yaml";
import fs from "fs"
import path from "path";
import { fileURLToPath } from 'url';

interface config {
    readonly postgres: {
        host: string;
        port: number;
        db: string;
        user: string;
        pass: string;
    };
    readonly server: {
        port: number;
    };

    PgConnectionString(): string;
    ServerPort(): number;
}


export class Config implements config {
    postgres: { host: string; port: number; db: string; user: string; pass: string; };
    server: { port: number; };

    constructor() {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filepath = path.join(__dirname, "../../../../config.yaml")    
        const file = fs.readFileSync(filepath, "utf8")
        const params = YAML.parse(file)

        this.postgres = params.postgres
        this.server = params.server
    }

    PgConnectionString(): string {
        return `postgres://${this.postgres.user}:${this.postgres.pass}@${this.postgres.host}:${this.postgres.port}/${this.postgres.db}`
    }

    ServerPort(): number {
        return this.server.port
    }
}