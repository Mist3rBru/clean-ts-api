import { Decrypter, FindUserByIdRepository } from '@/data/protocols'
import { UserModel } from '@/domain/models'
import { FindUserByToken } from '@/domain/usecases'

export class DbFindUserByToken implements FindUserByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly findUserByIdRepository: FindUserByIdRepository
  ) {}

  async find (token: string, role?: string): Promise<UserModel> {
    const userId = await this.decrypter.decrypt(token)
    if (!userId) return null
    const user = await this.findUserByIdRepository.findById(userId)
    if (!user) return null
    return null
  }
}
