FROM node:16
WORKDIR ./usr/src/clean-ts-api
COPY ./package*.json .
RUN npm ci --only=production