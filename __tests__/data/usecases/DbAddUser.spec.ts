import { DbAddUser } from '@/data/usecases'
import { HashGenerator, AddUserRepository, FindUserByEmailRepository } from '@/data/protocols'
import { mockAddUserParams, mockUserModel } from '@/tests/domain/mocks'
import { mockHashGenerator, mockAddUserRepository, mockFindUserByEmailRepository } from '@/tests/data/mocks'

type SutTypes = {
  sut: DbAddUser
  hashGeneratorSpy: HashGenerator
  addUserRepositorySpy: AddUserRepository
  findUserByEmailRepository: FindUserByEmailRepository
}

const makeSut = (): SutTypes => {
  const findUserByEmailRepository = mockFindUserByEmailRepository()
  jest.spyOn(findUserByEmailRepository, 'findByEmail').mockReturnValue(null)
  const addUserRepositorySpy = mockAddUserRepository()
  const hashGeneratorSpy = mockHashGenerator()
  const sut = new DbAddUser(
    hashGeneratorSpy,
    addUserRepositorySpy,
    findUserByEmailRepository
  )
  return {
    sut,
    hashGeneratorSpy,
    addUserRepositorySpy,
    findUserByEmailRepository
  }
}

describe('DbAddUser', () => {
  it('should return null when user is already registered', async () => {
    const { sut, findUserByEmailRepository } = makeSut()
    jest.spyOn(findUserByEmailRepository, 'findByEmail').mockImplementationOnce(
      async () => mockUserModel()
    )
    const user = await sut.add(mockAddUserParams())
    expect(user).toBeNull()
  })

  it('should call Encrypter with correct password', async () => {
    const { sut, hashGeneratorSpy } = makeSut()
    const encryptSpy = jest.spyOn(hashGeneratorSpy, 'generate')
    const model = mockAddUserParams()
    await sut.add(model)
    expect(encryptSpy).toHaveBeenCalledWith('any-password')
  })

  it('should call AddUserRepository with correct values', async () => {
    const { sut, addUserRepositorySpy } = makeSut()
    const addSpy = jest.spyOn(addUserRepositorySpy, 'add')
    const model = mockAddUserParams()
    await sut.add(model)
    expect(addSpy).toHaveBeenCalledWith(Object.assign(model, { password: 'hashed-password' }))
  })

  it('should return user if AddUserRepository return user', async () => {
    const { sut } = makeSut()
    const model = mockAddUserParams()
    const user = await sut.add(model)
    expect(user).toEqual(mockUserModel())
  })

  it('should throw if any dependency throws', async () => {
    const hashGeneratorSpy = mockHashGenerator()
    const addUserRepositorySpy = mockAddUserRepository()
    const findUserByEmailRepository = mockFindUserByEmailRepository()
    jest.spyOn(findUserByEmailRepository, 'findByEmail').mockReturnValue(null)
    const suts = [].concat(
      new DbAddUser(
        { generate: () => { throw new Error() } },
        addUserRepositorySpy,
        findUserByEmailRepository
      ),
      new DbAddUser(
        hashGeneratorSpy,
        { add: () => { throw new Error() } },
        findUserByEmailRepository
      ),
      new DbAddUser(
        hashGeneratorSpy,
        addUserRepositorySpy,
        { findByEmail: () => { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const promise = sut.add(mockAddUserParams())
      await expect(promise).rejects.toThrow()
    }
  })
})
