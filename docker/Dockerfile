FROM node:18-alpine3.16

ENV BASE_PATH "/jun_code/nodets/jrpc-server"

WORKDIR ${BASE_PATH}

COPY jrpc-server/package.json ${BASE_PATH}
RUN yarn install

COPY jrpc-server ${BASE_PATH}