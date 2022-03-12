import { Decrypter } from '@/data/protocols'
import { UserModel } from '@/domain/models'
import { FindUserByToken } from '@/domain/usecases'

export class DbFindUserByToken implements FindUserByToken {
  constructor (
    private readonly decrypter: Decrypter
  ) {}

  async find (token: string, role?: string): Promise<UserModel> {
    await this.decrypter.decrypt(token)
    return null
  }
}
