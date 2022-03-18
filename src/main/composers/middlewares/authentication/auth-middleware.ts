import { AuthMiddleware } from '@/presentation/middlewares'
import { Middleware } from '@/presentation/protocols'
import { makeDbFindUserByToken } from '@/main/composers/usecases'
import { makeAuthMiddlewareValidation } from '@/main/composers/middlewares'

export const makeAuthMiddleware = (role?: string): Middleware => {
  const findUserByToken = makeDbFindUserByToken()
  const validation = makeAuthMiddlewareValidation()
  return new AuthMiddleware(validation, findUserByToken, role)
}
