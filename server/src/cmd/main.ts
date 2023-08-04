import { Config } from './init/config/index.js';
import { PostgresDBase } from './init/db_connection/index.js'
import { Server } from './init/server_run/index.js'
import { Repository } from '../internal/repository/index.js'
import { Usecase } from '../internal/usecase/index.js'
import { ApiHandler } from '../external/rest/index.js'
import { ApiMiddleware } from '../external/rest/core/middleware/index.js';
import { SessionManager } from './init/session_manager/index.js';


const config = new Config()

const pgDbase = new PostgresDBase(config.PgConnectionString)
const client = await pgDbase.Connect()

const server = new Server(config.ServerPort, config.ServerOrigin)
const serverApp = await server.Run()

const sessionManager = new SessionManager(client)

const repository = new Repository()
const usecase = new Usecase(repository)

const middleware = new ApiMiddleware(config.TokenKey, config.SessionLifeDay)

const exteranl = new ApiHandler({
    app: serverApp,
    ui: usecase,
    middleware: middleware,
    sessionManager: sessionManager
})
exteranl.RegisterMethods()
