import { makeDbAuthentication, makeLoginValidation } from '@/main/composers'
import { LoginController } from '@/presentation/controllers'

export const makeLoginController = (): LoginController => {
  const validation = makeLoginValidation()
  const authentication = makeDbAuthentication()
  return new LoginController(authentication, validation)
}
