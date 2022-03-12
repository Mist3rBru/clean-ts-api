import { TokenValidator } from '@/data/protocols'
import { UserModel } from '@/domain/models'
import { FindUserByToken } from '@/domain/usecases'

export class DbFindUserByToken implements FindUserByToken {
  constructor (
    private readonly tokenValidator: TokenValidator
  ) {}

  async find (token: string, role?: string): Promise<UserModel> {
    await this.tokenValidator.validate(token)
    return null
  }
}
