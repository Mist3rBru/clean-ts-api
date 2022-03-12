import { Authentication, AuthenticationModel } from '@/domain/usecases'
import { FindUserByEmailRepository, HashComparator, TokenGenerator, token } from '@/data/protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashComparator: HashComparator,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth (credentials: AuthenticationModel): Promise<token> {
    const { email, password } = credentials
    const user = await this.findUserByEmailRepository.findByEmail(email)
    const isValid = user && await this.hashComparator.compare(password, user.password)
    if (!isValid) return null
    const token = await this.tokenGenerator.generate(user.id)
    return token
  }
}
