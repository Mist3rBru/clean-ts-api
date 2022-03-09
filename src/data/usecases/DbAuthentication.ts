import { Authentication, AuthenticationModel } from '@/domain/usecases'
import { token } from '@/domain/models'
import { FindUserByEmailRepository, EncrypterValidator, TokenGenerator } from '@/data/protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly encrypterValidator: EncrypterValidator,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth (credentials: AuthenticationModel): Promise<token> {
    const { email, password } = credentials
    const user = await this.findUserByEmailRepository.find(email)
    const isValid = user && await this.encrypterValidator.validate(password, user.password)
    if (!isValid) return null
    const token = await this.tokenGenerator.generate(user.id)
    return token
  }
}
