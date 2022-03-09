import { Authentication, AuthenticationModel } from '@/domain/usecases'
import { token } from '@/domain/models'
import { FindUserByEmailRepository, HashCompare, TokenGenerator } from '@/data/protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth (credentials: AuthenticationModel): Promise<token> {
    const { email, password } = credentials
    const user = await this.findUserByEmailRepository.find(email)
    const isValid = user && await this.hashCompare.compare(password, user.password)
    if (!isValid) return null
    const token = await this.tokenGenerator.generate(user.id)
    return token
  }
}
