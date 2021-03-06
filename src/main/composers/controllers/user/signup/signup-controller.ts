import { makeSignUpValidation } from '@/main/composers/controllers'
import { makeLogControllerDecorator } from '@/main/composers/decorators'
import { makeDbAddUser, makeDbAuthentication } from '@/main/composers/usecases'
import { SignUpController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeSignUpController = (): Controller => {
  const authentication = makeDbAuthentication()
  const addUser = makeDbAddUser()
  const validation = makeSignUpValidation()
  const controller = new SignUpController(validation, addUser, authentication)
  return makeLogControllerDecorator(controller)
}
