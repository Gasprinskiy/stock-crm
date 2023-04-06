import { JSONRPCServer } from "json-rpc-2.0";
import { Express } from "express";
import bodyParser from "body-parser";

// RunServer запуск jrpc сервера и возврат экземпляра класса JSONRPCServer для последующего взаимодействия
export const RunServer = (app: Express, port: number) : JSONRPCServer => {
    console.info("Запуск JRPC сервера...")

    const jsrpcServer = new JSONRPCServer();

    app.use(bodyParser.json());
    app.post("", (req, res) => {
        const jsonRPCRequest = req.body;

        jsrpcServer.receive(jsonRPCRequest)
        .then((response) => {
            if (response) {
                res.json(response);
            } else {
                res.sendStatus(204);
            }
        });
    });
    app.listen(port, () => console.info(`JRPC cервер запущен на порту ${port}`));

    return jsrpcServer
}