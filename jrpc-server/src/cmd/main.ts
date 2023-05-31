import { Config } from './init/config/index.js';
import { PostgresDBase } from './init/db_connection/index.js'
import { Server } from './init/server_run/index.js'
import { Repository } from '../internal/repository/index.js'
import { Usecase } from '../internal/usecase/index.js'
import { JRPCHandler } from '../external/jsonrpc/index.js'

const { env } = process
const config = new Config(env.CONF_PATH!)

const pgConectionString = config.PgConnectionString()
const pgDbase = new PostgresDBase(pgConectionString)
const db = await pgDbase.Connect()

const serverPort = config.ServerPort()
const server = new Server(serverPort)
const jsrpcServer = await server.Run()

const repository = new Repository()
const usecase = new Usecase(repository)

const jsrpcHandler = new JRPCHandler({
    jrpc: jsrpcServer,
    db: db,
    ui: usecase,
})
jsrpcHandler.RegisterMethods()