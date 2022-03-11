import { makeDbAuthentication, makeLogControllerDecorator, makeLoginValidation } from '@/main/composers'
import { LoginController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const composeLoginController = (): Controller => {
  const validation = makeLoginValidation()
  const authentication = makeDbAuthentication()
  const loginController = new LoginController(authentication, validation)
  return makeLogControllerDecorator(loginController)
}
