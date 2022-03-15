/* eslint-disable @typescript-eslint/no-misused-promises */
import { makeAddSurveyController, makeAuthMiddleware, makeListSurveysController } from '@/main/composers'
import { adaptController, adaptMiddleware } from '@/main/adapters'
import { Router } from 'express'

export default (router: Router): void => {
  router.route('/survey')
    .post(adaptMiddleware(makeAuthMiddleware('admin')), adaptController(makeAddSurveyController()))
    .get(adaptMiddleware(makeAuthMiddleware()), adaptController(makeListSurveysController()))
}
