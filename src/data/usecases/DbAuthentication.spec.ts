import { DbAuthentication } from '@/data/usecases'
import { FindUserByEmailRepository } from '@/data/protocols'
import { AuthenticationModel } from '@/domain/usecases'
import { UserModel } from '@/domain/models'

interface SutTypes {
  sut: DbAuthentication
  findUserByEmailRepositorySpy: FindUserByEmailRepository
}

const makeSut = (): SutTypes => {
  const findUserByEmailRepositorySpy = new FindUserByEmailRepositorySpy()
  const sut = new DbAuthentication(
    findUserByEmailRepositorySpy
  )
  return {
    sut,
    findUserByEmailRepositorySpy
  }
}

class FindUserByEmailRepositorySpy implements FindUserByEmailRepository {
  async find (email: string): Promise<UserModel> {
    return {
      id: 'any-id',
      name: 'any-name',
      email: email,
      password: 'any-password'
    }
  }
}

const makeFakeCredentials = (): AuthenticationModel => ({
  email: 'any-email',
  password: 'any-password'
})

describe('DbAuthentication', () => {
  it('should call FindUserByEmailRepository with correct email', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut()
    const findSpy = jest.spyOn(findUserByEmailRepositorySpy, 'find')
    const credentials = makeFakeCredentials()
    await sut.auth(credentials)
    expect(findSpy).toBeCalledWith(credentials.email)
  })
})
