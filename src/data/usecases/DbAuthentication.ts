import { Authentication, AuthenticationModel, token } from '@/domain/usecases'
import { FindUserByEmailRepository, HashCompare } from '@/data/protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashCompare: HashCompare
  ) {}

  async auth (credentials: AuthenticationModel): Promise<token> {
    const { email, password } = credentials
    const user = await this.findUserByEmailRepository.find(email)
    await this.hashCompare.compare(password, user.password)
    return null
  }
}
