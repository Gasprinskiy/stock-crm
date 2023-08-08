import { RedisClientType } from "redis";

export interface EmployeeCache {
    Set(empl_id: number, lifeTime: number): Promise<void>;
    InChache(empl_id: number): Promise<boolean>;
    Remove(empl_id: number): Promise<void>;
}

export class EmployeeCacheImpl implements EmployeeCache {
    private redisClient: RedisClientType;

    constructor(client: RedisClientType) {
        this.redisClient = client;
    }

    public async Set(empl_id: number, lifeTime: number): Promise<void> {
        try {
            await this.redisClient.set(`${empl_id}`, "true", {
                EX: lifeTime,
                NX: true
            })
        } catch(err: any) {
            throw err
        }
    }

    public async InChache(empl_id: number): Promise<boolean> {
        try {
            const inCache = await this.redisClient.get(`${empl_id}`)
            return Boolean(inCache)
        } catch(err: any) {
            throw err
        }
    }

    public async Remove(empl_id: number): Promise<void> {
        try {
            await this.redisClient.del(`${empl_id}`)
        } catch(err: any) {
            throw err
        }
    }
}