/* eslint-disable @typescript-eslint/no-misused-promises */
import { makeAddSurveyController, makeAuthMiddleware } from '@/main/composers'
import { adaptController, adaptMiddleware } from '@/main/adapters'
import { Router } from 'express'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware())
  router.post('/survey', adminAuth, adaptController(makeAddSurveyController()))
}
