/* eslint-disable @typescript-eslint/no-misused-promises */
import { makeAddSurveyController } from '@/main/composers'
import { adapt } from '@/main/adapters/express-router'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/survey', adapt(makeAddSurveyController()))
}
