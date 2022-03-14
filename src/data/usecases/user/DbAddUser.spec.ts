import { DbAddUser } from '@/data/usecases'
import {
  HashGenerator,
  AddUserRepository,
  hash,
  FindUserByEmailRepository,
} from '@/data/protocols'
import { UserModel } from '@/domain/models'
import { AddUserModel } from '@/domain/usecases'

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
    userRepositorySpy,
  }
}

class HashGeneratorSpy implements HashGenerator {
  async generate(value: string): Promise<hash> {
    return 'any-hash'
  }
}

class UserRepositorySpy
  implements AddUserRepository, FindUserByEmailRepository
{
  async add(model: AddUserModel): Promise<UserModel> {
    return {
      id: 'any-id',
      name: model.name,
      email: model.email,
      password: 'hashed-password',
    }
  }

  async findByEmail(email: string): Promise<UserModel> {
    return null
  }
}

const makeFakeUser = (): AddUserModel => ({
  name: 'any-name',
  email: 'any-email',
  password: 'any-password',
})

describe('DbAddUser', () => {
  it('should return null when user is already registered', async () => {
    const { sut, userRepositorySpy } = makeSut()
    const model = makeFakeUser()
    const fakeUser = Object.assign({}, model, { id: 'any-id' })
    jest
      .spyOn(userRepositorySpy, 'findByEmail')
      .mockImplementationOnce(async () => {
        return new Promise((resolve) => resolve(fakeUser))
      })
    const user = await sut.add(model)
    expect(user).toBeNull()
  })

  it('should call Encrypter with correct password', async () => {
    const { sut, hashGeneratorSpy } = makeSut()
    const encryptSpy = jest.spyOn(hashGeneratorSpy, 'generate')
    const userModel = makeFakeUser()
    await sut.add(userModel)
    expect(encryptSpy).toHaveBeenCalledWith(userModel.password)
  })

  it('should call AddUserRepository with correct values', async () => {
    const { sut, userRepositorySpy } = makeSut()
    const addSpy = jest.spyOn(userRepositorySpy, 'add')
    const userModel = makeFakeUser()
    await sut.add(userModel)
    expect(addSpy).toHaveBeenCalledWith({
      name: userModel.name,
      email: userModel.email,
      password: 'any-hash',
    })
  })

  it('should return user if AddUserRepository return user', async () => {
    const { sut } = makeSut()
    const userModel = makeFakeUser()
    const user = await sut.add(userModel)
    expect(user).toEqual({
      id: 'any-id',
      name: userModel.name,
      email: userModel.email,
      password: 'hashed-password',
    })
  })

  it('should throw if any dependency throws', async () => {
    const hashGeneratorSpy = new HashGeneratorSpy()
    const addUserRepositorySpy = new UserRepositorySpy()
    const suts = [].concat(
      new DbAddUser(
        {
          generate: () => {
            throw new Error()
          },
        },
        addUserRepositorySpy,
        addUserRepositorySpy
      ),
      new DbAddUser(
        hashGeneratorSpy,
        {
          add: () => {
            throw new Error()
          },
        },
        addUserRepositorySpy
      ),
      new DbAddUser(hashGeneratorSpy, addUserRepositorySpy, {
        findByEmail: () => {
          throw new Error()
        },
      })
    )
    for (const sut of suts) {
      const userModel = makeFakeUser()
      const promise = sut.add(userModel)
      void expect(promise).rejects.toThrow()
    }
  })
})
