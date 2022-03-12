import { Decrypter, FindUserByIdRepository } from '@/data/protocols'
import { DbFindUserByToken } from '@/data/usecases'
import { UserModel } from '@/domain/models'

interface SutTypes {
  sut: DbFindUserByToken
  decrypterSpy: Decrypter
  findUserByIdRepository: FindUserByIdRepository
}

const makeSut = (): SutTypes => {
  const findUserByIdRepository = new FindUserByIdRepositorySpy()
  const decrypterSpy = new DecrypterSpy()
  const sut = new DbFindUserByToken(
    decrypterSpy,
    findUserByIdRepository
  )
  return {
    sut,
    decrypterSpy,
    findUserByIdRepository
  }
}

class DecrypterSpy implements Decrypter {
  async decrypt (token: string): Promise<string> {
    return 'any-value'
  }
}

class FindUserByIdRepositorySpy implements FindUserByIdRepository {
  async findById (id: string): Promise<UserModel> {
    return {
      id: 'any-id',
      name: 'any-name',
      email: 'any-email',
      password: 'any-password'
    }
  }
}

describe('DbFindUserByToken', () => {
  it('should call Decrypter with correct value', async () => {
    const { sut, decrypterSpy } = makeSut()
    const decryptSpy = jest.spyOn(decrypterSpy, 'decrypt')
    await sut.find('any-token')
    expect(decryptSpy).toBeCalledWith('any-token')
  })

  it('should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt').mockReturnValueOnce(null)
    const user = await sut.find('any-token')
    expect(user).toBeNull()
  })
})
