import { Config } from './init/config/index.js'
import { PostgresDBase } from './init/db_connection/index.js'
import { Server } from './init/server_run/index.js'
import { Repository } from '../internal/repository/index.js'

import { CreateProductPayload } from '../internal/entity/product/index.js'

const { env } = process
const config = new Config(env.CONF_PATH!)

const pgConectionString = config.PgConnectionString()
const pgDbase = new PostgresDBase(pgConectionString)
const db = await pgDbase.ConnectToDb()

const serverPort = config.ServerPort()
const server = new Server(serverPort)
const jsrpcServer = await server.RunServer()

const repository = new Repository()

jsrpcServer.addMethod('getProduct', async (id: number) => {
    const resposne = await db.tx((ts) => {
        return repository.Product.getProductByID(ts, id)
    })
    return resposne
})

jsrpcServer.addMethod('createProduct', async (params: CreateProductPayload) => {
    const resposne = await db.tx((ts) => {
        return repository.Product.createProduct(ts, params)
    })
    return resposne
})