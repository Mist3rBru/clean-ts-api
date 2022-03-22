import { cors, jsonParser, contentType, noCache } from '@/main/middlewares'
import SwaggerConfig from '@/main/docs'
import { serve, setup } from 'swagger-ui-express'
import express, { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { resolve } from 'path'

class App {
  express: Express
  router: Router

  constructor () {
    this.express = express()
    this.router = express.Router()
    this._docs()
    this._middlewares()
    this._routes()
  }

  _docs (): void {
    this.express.use('/docs', noCache, serve, setup(SwaggerConfig))
  }

  _middlewares (): void {
    this.express.disable('x-powered-by')
    this.express.use(cors)
    this.express.use(jsonParser)
    this.express.use(contentType)
  }

  _routes (): void {
    this.express.use('/api', this.router)
    readdirSync(resolve(__dirname, '../routes')).map(async (file) => {
      (await import(`../routes/${file}`)).default(this.router)
    })
  }
}

export const app = new App().express
