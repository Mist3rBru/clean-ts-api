import { DbAddUser } from '@/data/usecases'
import { mockAddUserParams, mockUserModel } from '@/tests/domain/mocks'
import { HashGeneratorSpy, AddUserRepositorySpy, FindUserByEmailRepositorySpy } from '@/tests/data/mocks'

type SutTypes = {
  sut: DbAddUser
  hashGeneratorSpy: HashGeneratorSpy
  addUserRepositorySpy: AddUserRepositorySpy
  findUserByEmailRepositorySpy: FindUserByEmailRepositorySpy
}

const makeSut = (): SutTypes => {
  const findUserByEmailRepositorySpy = new FindUserByEmailRepositorySpy()
  findUserByEmailRepositorySpy.user = null
  const addUserRepositorySpy = new AddUserRepositorySpy()
  const hashGeneratorSpy = new HashGeneratorSpy()
  const sut = new DbAddUser(
    hashGeneratorSpy,
    addUserRepositorySpy,
    findUserByEmailRepositorySpy
  )
  return {
    sut,
    hashGeneratorSpy,
    addUserRepositorySpy,
    findUserByEmailRepositorySpy
  }
}

describe('DbAddUser', () => {
  it('should return null when user is already registered', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut()
    findUserByEmailRepositorySpy.user = mockUserModel()
    const user = await sut.add(mockAddUserParams())
    expect(user).toBeNull()
  })

  it('should call Encrypter with correct password', async () => {
    const { sut, hashGeneratorSpy } = makeSut()
    const model = mockAddUserParams()
    await sut.add(model)
    expect(hashGeneratorSpy.data).toBe(model.password)
  })

  it('should call AddUserRepository with correct values', async () => {
    const { sut, addUserRepositorySpy, hashGeneratorSpy } = makeSut()
    const model = mockAddUserParams()
    await sut.add(model)
    model.password = hashGeneratorSpy.hash
    expect(addUserRepositorySpy.data).toEqual(model)
  })

  it('should return user if AddUserRepository return user', async () => {
    const { sut, addUserRepositorySpy } = makeSut()
    const model = mockAddUserParams()
    const user = await sut.add(model)
    expect(user).toEqual(addUserRepositorySpy.user)
  })

  it('should throw if any dependency throws', async () => {
    const hashGeneratorSpy = new HashGeneratorSpy()
    const addUserRepositorySpy = new AddUserRepositorySpy()
    const findUserByEmailRepositorySpy = new FindUserByEmailRepositorySpy()
    findUserByEmailRepositorySpy.user = null
    const suts = [].concat(
      new DbAddUser(
        { generate: () => { throw new Error() } },
        addUserRepositorySpy,
        findUserByEmailRepositorySpy
      ),
      new DbAddUser(
        hashGeneratorSpy,
        { add: () => { throw new Error() } },
        findUserByEmailRepositorySpy
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
