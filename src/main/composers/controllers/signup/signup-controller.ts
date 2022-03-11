import { Controller } from '@/presentation/protocols'
import { LogRepository } from '@/infra/database/mongodb'
import { SignUpController } from '@/presentation/controllers'
import { LogControllerDecorator } from '@/main/decorators'
import { makeDbAddUser, makeDbAuthentication, makeSignUpValidation } from '@/main/composers'

export const composeSignUpController = (): Controller => {
  const logErrorRepository = new LogRepository()
  const authentication = makeDbAuthentication()
  const addUser = makeDbAddUser()
  const validation = makeSignUpValidation()
  const signUpController = new SignUpController(validation, addUser, authentication)
  return new LogControllerDecorator(signUpController, logErrorRepository)
}
