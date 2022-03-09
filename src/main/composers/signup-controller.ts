import { Controller } from '@/presentation/protocols'
import { UserRepository, LogRepository } from '@/infra/database/mongodb'
import { BcryptAdapter } from '@/infra/cryptography'
import { DbAddUser } from '@/data/usecases'
import { SignUpController } from '@/presentation/controllers'
import { LogControllerDecorator } from '@/main/decorators'
import { makeSignUpValidation } from '@/main/composers'

export const composeSignUpController = (): Controller => {
  const salt = 8
  const addUserRepository = new UserRepository()
  const encrypter = new BcryptAdapter(salt)
  const addUser = new DbAddUser(encrypter, addUserRepository)
  const logErrorRepository = new LogRepository()
  const signUpController = new SignUpController(addUser, makeSignUpValidation())
  return new LogControllerDecorator(signUpController, logErrorRepository)
}
