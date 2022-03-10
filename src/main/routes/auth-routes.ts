/* eslint-disable @typescript-eslint/no-misused-promises */
import { adapt } from '@/main/adapters/express-router'
import { composeLoginController, composeSignUpController } from '@/main/composers'
import { Router } from 'express'

export default (router: Router): any => {
  router.post('/signup', adapt(composeSignUpController()))
  router.post('/login', adapt(composeLoginController()))
}
