import { Authentication } from '@/domain/usecases'
import { FindUserByEmailRepository, HashComparator, Encrypter } from '@/data/protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashComparator: HashComparator,
    private readonly encrypter: Encrypter
  ) {}

  async auth (data: Authentication.Params): Promise<Authentication.Result> {
    const { email, password } = data
    const user = await this.findUserByEmailRepository.findByEmail(email)
    const isValid =
      user && (await this.hashComparator.compare(password, user.password))
    if (!isValid) return null
    const token = await this.encrypter.encrypt(user.id)
    return {
      accessToken: token,
      userName: user.name
    }
  }
}
