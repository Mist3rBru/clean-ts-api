import { DbAddUser } from '@/data/usecases'
import { HashGenerator, AddUserRepository, hash, FindUserByEmailRepository } from '@/data/protocols'
import { UserModel } from '@/domain/models'
import { AddUserParams } from '@/domain/usecases'
import { mockAddUserParams, mockUserModel } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbAddUser
  hashGeneratorSpy: HashGenerator
  userRepositorySpy: AddUserRepository & FindUserByEmailRepository
}

const makeSut = (): SutTypes => {
  const userRepositorySpy = new UserRepositorySpy()
  const hashGeneratorSpy = new HashGeneratorSpy()
  const sut = new DbAddUser(
    hashGeneratorSpy,
    userRepositorySpy,
    userRepositorySpy
  )
  return {
    sut,
    hashGeneratorSpy,
    userRepositorySpy
  }
}

class HashGeneratorSpy implements HashGenerator {
  async generate (value: string): Promise<hash> {
    return 'hashed-password'
  }
}

class UserRepositorySpy implements AddUserRepository, FindUserByEmailRepository {
  async add (model: AddUserParams): Promise<UserModel> {
    return mockUserModel()
  }

  async findByEmail (email: string): Promise<UserModel> {
    return null
  }
}

describe('DbAddUser', () => {
  it('should return null when user is already registered', async () => {
    const { sut, userRepositorySpy } = makeSut()
    jest.spyOn(userRepositorySpy, 'findByEmail').mockImplementationOnce(
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
    const { sut, userRepositorySpy } = makeSut()
    const addSpy = jest.spyOn(userRepositorySpy, 'add')
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
    const hashGeneratorSpy = new HashGeneratorSpy()
    const addUserRepositorySpy = new UserRepositorySpy()
    const suts = [].concat(
      new DbAddUser(
        { generate: () => { throw new Error() } },
        addUserRepositorySpy,
        addUserRepositorySpy
      ),
      new DbAddUser(
        hashGeneratorSpy,
        {
          add: () => {
            throw new Error()
          }
        },
        addUserRepositorySpy
      ),
      new DbAddUser(hashGeneratorSpy, addUserRepositorySpy, {
        findByEmail: () => {
          throw new Error()
        }
      })
    )
    for (const sut of suts) {
      const promise = sut.add(mockAddUserParams())
      void expect(promise).rejects.toThrow()
    }
  })
})
