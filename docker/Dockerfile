FROM node:18-alpine3.16

ENV BASE_PATH "/jun_code/nodets/server"

WORKDIR ${BASE_PATH}

COPY server/package.json ${BASE_PATH}
RUN yarn install

COPY server ${BASE_PATH}