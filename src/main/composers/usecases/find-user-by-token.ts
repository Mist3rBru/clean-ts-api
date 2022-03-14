import { DbFindUserByToken } from '@/data/usecases'
import { JwtAdapter } from '@/infra/cryptography'
import { UserRepository } from '@/infra/database/mongodb'
import { env } from '@/main/config'

export const makeDbFindUserByToken = (): DbFindUserByToken => {
  const findUserByIdRepository = new UserRepository()
  const decrypter = new JwtAdapter(env.TOKEN_SECRET)
  return new DbFindUserByToken(decrypter, findUserByIdRepository)
}
