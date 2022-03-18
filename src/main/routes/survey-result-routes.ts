/* eslint-disable @typescript-eslint/no-misused-promises */
import { makeSaveSurveyResultController } from '@/main/composers/controllers'
import { makeAuthMiddleware } from '@/main/composers/middlewares'
import { adaptController, adaptMiddleware } from '@/main/adapters'
import { Router } from 'express'

export default (router: Router): void => {
  router.put('/survey/:surveyId/results', adaptMiddleware(makeAuthMiddleware()), adaptController(makeSaveSurveyResultController()))
}
