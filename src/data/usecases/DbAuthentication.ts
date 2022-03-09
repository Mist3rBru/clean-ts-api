import { Authentication, AuthenticationModel, token } from '@/domain/usecases'
import { FindUserByEmailRepository, HashCompare } from '@/data/protocols'
import { UnauthorizedError } from '@/presentation/errors'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashCompare: HashCompare
  ) {}

  async auth (credentials: AuthenticationModel): Promise<token> {
    const { email, password } = credentials
    const user = await this.findUserByEmailRepository.find(email)
    const isValid = user && await this.hashCompare.compare(password, user.password)
    if (!isValid) return null
    return null
  }
}
