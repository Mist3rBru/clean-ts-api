/* eslint-disable @typescript-eslint/no-misused-promises */
import { makeLoginController, makeSignUpController } from '@/main/composers'
import { adapt } from '@/main/adapters/express-router'
import { Router } from 'express'

export default (router: Router): any => {
  router.post('/signup', adapt(makeSignUpController()))
  router.post('/login', adapt(makeLoginController()))
}
