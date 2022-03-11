import { makeDbAddUser, makeDbAuthentication, makeSignUpValidation } from '@/main/composers'
import { SignUpController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeSignUpController = (): Controller => {
  const authentication = makeDbAuthentication()
  const addUser = makeDbAddUser()
  const validation = makeSignUpValidation()
  return new SignUpController(validation, addUser, authentication)
}
