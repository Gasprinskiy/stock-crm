import { Config } from './init/config/index.js';
import { PostgresDBase } from './init/db_connection/index.js'
import { Server } from './init/server_run/index.js'
import { Repository } from '../internal/repository/index.js'
import { Usecase } from '../internal/usecase/index.js'
import { ApiHandler } from '../external/rest/index.js'
import { ApiMiddleware } from '../external/rest/core/middleware/index.js';
import { SessionManager } from './init/session_manager/index.js';


const config = new Config()

const pgConectionString = config.PgConnectionString()
const pgDbase = new PostgresDBase(pgConectionString)
const db = await pgDbase.Connect()
const client = await pgDbase.ConnectToClient()

const sessionManager = new SessionManager(client)

const repository = new Repository()
const usecase = new Usecase(repository)

const middleware = new ApiMiddleware(config.TokenKey())

const serverPort = config.ServerPort()
const server = new Server(serverPort)
const serverApp = server.Run()

const exteranl = new ApiHandler({
    app: serverApp,
    db: db,
    ui: usecase,
    middleware: middleware,
    sessionManager: sessionManager
})
exteranl.RegisterMethods()
