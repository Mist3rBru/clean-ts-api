import { Express } from 'express'
import { cors, jsonParser, contentType } from '@/main/middlewares'

export default (app: Express): void => {
  app.disable('x-powered-by')
  app.use(cors)
  app.use(jsonParser)
  app.use(contentType)
}
