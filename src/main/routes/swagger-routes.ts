import SwaggerConfig from '@/main/docs'
import { noCache } from '@/main/middlewares'
import { serve, setup } from 'swagger-ui-express'
import { Router } from 'express'

export default (router: Router): void => {
  router.use('/docs', noCache, serve, setup(SwaggerConfig))
}
