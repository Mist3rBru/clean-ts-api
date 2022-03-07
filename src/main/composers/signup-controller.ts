import { UserRepository } from '@/infra/database/mongodb'
import { BcryptAdapter } from '@/infra/cryptography'
import { DbAddUser } from '@/data/usecases'
import { EmailValidatorAdapter } from '@/validation/validators'
import { SignUpController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const composeSignUpController = (): Controller => {
  const addUserRepository = new UserRepository()
  const encrypter = new BcryptAdapter(8)
  const addUser = new DbAddUser(
    encrypter,
    addUserRepository
  )

  const emailValidator = new EmailValidatorAdapter()
    
  return new SignUpController(
    emailValidator,
    addUser
  )
}
