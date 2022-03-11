import { makeDbAddUser, makeDbAuthentication, makeLogControllerDecorator, makeSignUpValidation } from '@/main/composers'
import { SignUpController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const composeSignUpController = (): Controller => {
  const authentication = makeDbAuthentication()
  const addUser = makeDbAddUser()
  const validation = makeSignUpValidation()
  const signUpController = new SignUpController(validation, addUser, authentication)
  return makeLogControllerDecorator(signUpController)
}
