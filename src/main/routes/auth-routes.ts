/* eslint-disable @typescript-eslint/no-misused-promises */
import { adapt } from '@/main/adapters/express-router'
import { composeSignUpController } from '@/main/composers/signup-controller'
import { Router } from 'express'

export default (router: Router): any => {
  router.post('/signup', adapt(composeSignUpController()))
}
