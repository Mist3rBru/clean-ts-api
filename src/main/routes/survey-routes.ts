/* eslint-disable @typescript-eslint/no-misused-promises */
import { makeAddSurveyController, makeListSurveysController } from '@/main/composers/controllers'
import { makeAuthMiddleware } from '@/main/composers/middlewares'
import { adaptController, adaptMiddleware } from '@/main/adapters'
import { Router } from 'express'

export default (router: Router): void => {
  router.route('/survey')
    .post(adaptMiddleware(makeAuthMiddleware('admin')), adaptController(makeAddSurveyController()))
    .get(adaptMiddleware(makeAuthMiddleware()), adaptController(makeListSurveysController()))
}
