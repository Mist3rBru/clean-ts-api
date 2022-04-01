import express, { Express } from 'express'
import setupDocs from './docs'
import setupStaticFiles from './static-files'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import setupGraphql from './graphql'

export const setupApp = async (): Promise<Express> => {
  const app = express()
  const router = express.Router()
  setupDocs(app)
  setupStaticFiles(app)
  setupMiddlewares(app)
  setupRoutes(app, router)
  await setupGraphql(app)
  return app
}
