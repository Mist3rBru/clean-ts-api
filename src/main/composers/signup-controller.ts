import { Controller } from '@/presentation/protocols'
import { UserRepository, LogRepository } from '@/infra/database/mongodb'
import { BcryptAdapter } from '@/infra/cryptography'
import { DbAddUser } from '@/data/usecases'
import { EmailValidatorAdapter } from '@/validation/validators'
import { SignUpController } from '@/presentation/controllers'
import { LogControllerDecorator } from '@/main/decorators'

export const composeSignUpController = (): Controller => {
  const salt = 8
  const addUserRepository = new UserRepository()
  const encrypter = new BcryptAdapter(salt)
  const addUser = new DbAddUser(encrypter, addUserRepository)
  const emailValidator = new EmailValidatorAdapter()
  const logErrorRepository = new LogRepository()
  const signUpController = new SignUpController(emailValidator, addUser)
  return new LogControllerDecorator(signUpController, logErrorRepository)
}
