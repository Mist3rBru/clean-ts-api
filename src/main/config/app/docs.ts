import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'
import { noCache } from '@/main/middlewares'
import SwaggerConfig from '@/main/docs'

export default (app: Express): void => {
  app.use('/docs', noCache, serve, setup(SwaggerConfig))
}
