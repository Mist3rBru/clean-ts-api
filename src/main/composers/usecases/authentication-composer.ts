import { DbAuthentication } from '@/data/usecases'
import { BcryptAdapter, JwtAdapter } from '@/infra/cryptography'
import { UserRepository } from '@/infra/database/mongodb'
import { env } from '@/main/config'

export const makeDbAuthentication = (): DbAuthentication => {
  const encrypter = new JwtAdapter(env.TOKEN_SECRET)
  const hashComparator = new BcryptAdapter(12)
  const findUserByEmailRepository = new UserRepository()
  return new DbAuthentication(findUserByEmailRepository, hashComparator, encrypter)
}
