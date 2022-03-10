import { DbAuthentication } from '@/data/usecases'
import { makeLoginValidation } from '@/main/composers'
import { LogRepository, UserRepository } from '@/infra/database/mongodb'
import { LogControllerDecorator } from '@/main/decorators'
import { LoginController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { env } from '@/main/config'

export const composeLoginController = (): Controller => {
  const tokenGenerator = new JwtAdapter(env.TOKEN_SECRET)
  const hashComparator = new BcryptAdapter(8)
  const findUserByEmailRepository = new UserRepository()
  const authentication = new DbAuthentication(findUserByEmailRepository, hashComparator, tokenGenerator)
  const validations = makeLoginValidation()
  const loginController = new LoginController(authentication, validations)
  const logErrorRepository = new LogRepository()
  return new LogControllerDecorator(loginController, logErrorRepository)
}
