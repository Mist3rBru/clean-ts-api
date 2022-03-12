/* eslint-disable @typescript-eslint/no-misused-promises */
import { makeLoginController, makeSignUpController } from '@/main/composers'
import { adaptController } from '@/main/adapters'
import { Router } from 'express'

export default (router: Router): any => {
  router.post('/signup', adaptController(makeSignUpController()))
  router.post('/login', adaptController(makeLoginController()))
}
