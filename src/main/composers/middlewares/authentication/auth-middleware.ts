import { AuthMiddleware } from '@/presentation/middlewares'
import { Middleware } from '@/presentation/protocols'
import { makeAuthMiddlewareValidation, makeDbFindUserByToken } from '@/main/composers'

export const makeAuthMiddleware = (): Middleware => {
  const findUserByToken = makeDbFindUserByToken()
  const validation = makeAuthMiddlewareValidation()
  return new AuthMiddleware(validation, findUserByToken)
}
