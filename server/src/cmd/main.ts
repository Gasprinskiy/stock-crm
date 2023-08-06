import { Config } from './init/config/index.js';
import { PostgresDBase } from './init/db_connection/index.js'
import { Server } from './init/server_run/index.js'
import { Repository } from '../internal/repository/index.js'
import { Usecase } from '../internal/usecase/index.js'
import { ApiHandler } from '../external/rest/index.js'
import { ApiMiddleware } from '../external/rest/core/middleware/index.js';
import { SessionManager } from './init/session_manager/index.js';
import { Redis } from './init/reddis_connection/index.js';


const config = new Config()

const pgDbase = new PostgresDBase(config.PgConnectionString)
const pgClient = await pgDbase.Connect()

const redis = new Redis(config.RedisConnectionString)
const redisClient = await redis.Connect()

const server = new Server(config.ServerPort, config.ServerOrigin)
const serverApp = await server.Run()

const sessionManager = new SessionManager(pgClient)

const repository = new Repository({
    redis: redisClient
})
const usecase = new Usecase(repository)

const middleware = new ApiMiddleware({
    token_key: config.TokenKey, 
    session_life_day: config.SessionLifeDay,
    employeeChache: repository.EmployeeCache
})

const exteranl = new ApiHandler({
    app: serverApp,
    ui: usecase,
    middleware: middleware,
    sessionManager: sessionManager
})
exteranl.RegisterMethods()
