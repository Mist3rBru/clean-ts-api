/* eslint-disable @typescript-eslint/no-misused-promises */
import { makeAddSurveyResultController, makeLoadSurveyResultController } from '@/main/composers/controllers'
import { makeAuthMiddleware } from '@/main/composers/middlewares'
import { adaptController, adaptMiddleware } from '@/main/adapters'
import { Router } from 'express'

export default (router: Router): void => {
  router.get('/survey/:surveyId/results', adaptMiddleware(makeAuthMiddleware()), adaptController(makeLoadSurveyResultController()))
  router.put('/survey/:surveyId/results', adaptMiddleware(makeAuthMiddleware()), adaptController(makeAddSurveyResultController()))
}
