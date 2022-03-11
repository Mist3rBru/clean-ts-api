import { makeDbAuthentication, makeLoginValidation } from '@/main/composers'
import { LoginController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoginController = (): Controller => {
  const validation = makeLoginValidation()
  const authentication = makeDbAuthentication()
  return new LoginController(authentication, validation)
}
