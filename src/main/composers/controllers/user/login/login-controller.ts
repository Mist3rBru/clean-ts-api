import { makeDbAuthentication, makeLogControllerDecorator, makeLoginValidation } from '@/main/composers'
import { LoginController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoginController = (): Controller => {
  const validation = makeLoginValidation()
  const authentication = makeDbAuthentication()
  const controller = new LoginController(authentication, validation)
  return makeLogControllerDecorator(controller)
}
