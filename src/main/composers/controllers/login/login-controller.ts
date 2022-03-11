import { LogRepository } from '@/infra/database/mongodb'
import { LogControllerDecorator } from '@/main/decorators'
import { LoginController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeDbAuthentication, makeLoginValidation } from '@/main/composers'

export const composeLoginController = (): Controller => {
  const logErrorRepository = new LogRepository()
  const validation = makeLoginValidation()
  const authentication = makeDbAuthentication()
  const loginController = new LoginController(authentication, validation)
  return new LogControllerDecorator(loginController, logErrorRepository)
}
