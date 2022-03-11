import { UserRepository } from '@/infra/database/mongodb'
import { BcryptAdapter } from '@/infra/cryptography'
import { DbAddUser } from '@/data/usecases'

export const makeDbAddUser = (): DbAddUser => {
  const addUserRepository = new UserRepository()
  const hashGenerator = new BcryptAdapter(12)
  return new DbAddUser(hashGenerator, addUserRepository)
}
