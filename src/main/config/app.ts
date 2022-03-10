import express, { Express, Router } from 'express'
import { cors, jsonParser, contentType } from '@/main/middlewares'
import { readdirSync } from 'fs'
import { resolve } from 'path'

class App {
  express: Express
  router: Router

  constructor () {
    this.express = express()
    this.router = express.Router()
    this._middlewares()
    this._routes()
  }

  _middlewares (): void {
    this.express.disable('x-powered-by')
    this.express.use(cors)
    this.express.use(jsonParser)
    this.express.use(contentType)
  }

  _routes (): void {
    this.express.use('/api', this.router)
    const routesPath = resolve(__dirname, '../routes')
    readdirSync(routesPath)
      .map(async file => {
        if (!file.includes('.test.')) {
          (await import(`../routes/${file}`)).default(this.router)
        }
      })
  }
}

export const app = new App().express
