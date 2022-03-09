import { Authentication, AuthenticationModel, token } from '@/domain/usecases'
import { FindUserByEmailRepository } from '@/data/protocols'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly findUserByEmailRepository: FindUserByEmailRepository
  ) {}

  async auth (credentials: AuthenticationModel): Promise<token> {
    await this.findUserByEmailRepository.find(credentials.email)
    return new Promise(resolve => resolve(''))
  }
}
