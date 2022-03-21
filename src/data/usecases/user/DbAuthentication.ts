import { Authentication, AuthenticationParams } from '@/domain/usecases'
import {
  FindUserByEmailRepository,
  HashComparator,
  Encrypter
} from '@/data/protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly hashComparator: HashComparator,
    private readonly encrypter: Encrypter
  ) {}

  async auth (credentials: AuthenticationParams): Promise<string> {
    const { email, password } = credentials
    const user = await this.findUserByEmailRepository.findByEmail(email)
    const isValid =
      user && (await this.hashComparator.compare(password, user.password))
    if (!isValid) return null
    const token = await this.encrypter.encrypt(user.id)
    return token
  }
}
