/* eslint-disable @typescript-eslint/no-misused-promises */
import { makeAddSurveyController } from '@/main/composers'
import { adaptController } from '@/main/adapters'
import { Router } from 'express'

export default (router: Router): void => {
  router.post('/survey', adaptController(makeAddSurveyController()))
}
