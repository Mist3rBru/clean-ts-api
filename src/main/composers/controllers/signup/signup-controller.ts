import { makeDbAddUser, makeDbAuthentication, makeSignUpValidation } from '@/main/composers'
import { SignUpController } from '@/presentation/controllers'

export const makeSignUpController = (): SignUpController => {
  const authentication = makeDbAuthentication()
  const addUser = makeDbAddUser()
  const validation = makeSignUpValidation()
  return new SignUpController(validation, addUser, authentication)
}
