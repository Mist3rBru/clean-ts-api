import { makeLoginValidation } from '@/main/composers/controllers'
import { makeDbAuthentication } from '@/main/composers/usecases'
import { makeLogControllerDecorator } from '@/main/composers/decorators'
import { LoginController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoginController = (): Controller => {
  const validation = makeLoginValidation()
  const authentication = makeDbAuthentication()
  const controller = new LoginController(authentication, validation)
  return makeLogControllerDecorator(controller)
}
