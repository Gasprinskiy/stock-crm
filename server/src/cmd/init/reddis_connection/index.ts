import { createClient, RedisClientType } from 'redis';
import { Logger } from '../../../tools/logger/index.js';

export class Redis {
    private client: RedisClientType;
    private log: Logger;

    constructor(connectionString: string) {
        this.client = createClient({
            url: connectionString
        })
        this.log = new Logger("redis-connection")
    }

    public async Connect(): Promise<RedisClientType> {
        this.log.Info("Connecting to redis...")
        try {
            await this.client.connect()
            this.log.Info("Connection to redis was successful")
            return this.client
        } catch(err: any) {
            this.log.Error(err, "Error while connecting to redis")
            this.client.quit()
            process.exit(1)
        }
    }
}