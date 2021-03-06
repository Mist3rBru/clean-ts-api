import { Decrypter, FindUserByIdRepository } from '@/data/protocols'
import { FindUserByToken } from '@/domain/usecases'

export class DbFindUserByToken implements FindUserByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly findUserByIdRepository: FindUserByIdRepository
  ) {}

  async findByToken (data: FindUserByToken.Params): Promise<FindUserByToken.Result> {
    const { token, role } = data
    const userId = await this.decrypter.decrypt(token)
    if (!userId) return null
    const user = await this.findUserByIdRepository.findById(userId)
    if (!user) return null
    if (role && role !== user.role) return null
    return user
  }
}
