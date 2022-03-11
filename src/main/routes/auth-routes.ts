/* eslint-disable @typescript-eslint/no-misused-promises */
import { makeLoginController, makeSignUpController, makeLogControllerDecorator } from '@/main/composers'
import { adapt } from '@/main/adapters/express-router'
import { Router } from 'express'

export default (router: Router): any => {
  router.post('/signup', adapt(makeLogControllerDecorator(makeSignUpController())))
  router.post('/login', adapt(makeLogControllerDecorator(makeLoginController())))
}
