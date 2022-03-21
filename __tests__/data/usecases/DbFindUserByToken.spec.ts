import { Decrypter, FindUserByIdRepository } from '@/data/protocols'
import { DbFindUserByToken } from '@/data/usecases'
import { mockUserModel } from '@/tests/domain/mocks'
import { mockDecrypter, mockFindUserByIdRepository } from '@/tests/data/mocks'

type SutTypes = {
  sut: DbFindUserByToken
  decrypterSpy: Decrypter
  findUserByIdRepositorySpy: FindUserByIdRepository
}

const makeSut = (): SutTypes => {
  const findUserByIdRepositorySpy = mockFindUserByIdRepository()
  const decrypterSpy = mockDecrypter()
  const sut = new DbFindUserByToken(decrypterSpy, findUserByIdRepositorySpy)
  return {
    sut,
    decrypterSpy,
    findUserByIdRepositorySpy
  }
}

describe('DbFindUserByToken', () => {
  it('should call Decrypter with correct value', async () => {
    const { sut, decrypterSpy } = makeSut()
    const decryptSpy = jest.spyOn(decrypterSpy, 'decrypt')
    await sut.findByToken('any-token')
    expect(decryptSpy).toBeCalledWith('any-token')
  })

  it('should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt').mockReturnValueOnce(null)
    const user = await sut.findByToken('any-token')
    expect(user).toBeNull()
  })

  it('should call FindUserByIdRepository with correct value', async () => {
    const { sut, findUserByIdRepositorySpy } = makeSut()
    const findSpy = jest.spyOn(findUserByIdRepositorySpy, 'findById')
    await sut.findByToken('any-token')
    expect(findSpy).toBeCalledWith('any-id')
  })

  it('should return null if FindUserByIdRepository returns null', async () => {
    const { sut, findUserByIdRepositorySpy } = makeSut()
    jest.spyOn(findUserByIdRepositorySpy, 'findById').mockReturnValueOnce(null)
    const user = await sut.findByToken('any-token')
    expect(user).toBeNull()
  })

  it('should return null if user role is different from param role', async () => {
    const { sut, findUserByIdRepositorySpy } = makeSut()
    jest.spyOn(findUserByIdRepositorySpy, 'findById').mockImplementationOnce(async () => mockUserModel())
    const user = await sut.findByToken('any-token', 'any-role')
    expect(user).toBeNull()
  })

  it('should return user if user role is equal param role', async () => {
    const { sut } = makeSut()
    const user = await sut.findByToken('any-token', 'any-role')
    expect(user).toEqual(mockUserModel('any-role'))
  })

  it('should return user if no param role is provided', async () => {
    const { sut } = makeSut()
    const user = await sut.findByToken('any-token')
    expect(user).toEqual(mockUserModel('any-role'))
  })
})
