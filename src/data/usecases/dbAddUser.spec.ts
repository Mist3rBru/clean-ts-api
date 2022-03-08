import { DbAddUser } from '@/data/usecases'
import { Encrypter, AddUserRepository, hash } from '@/data/protocols'
import { UserModel } from '@/domain/models'
import { AddUserModel } from '@/domain/usecases'

interface SutTypes {
  sut: DbAddUser
  encrypterSpy: Encrypter
  addUserRepositorySpy: AddUserRepository
}

const makeSut = (): SutTypes => {
  const addUserRepositorySpy = new AddUserRepositorySpy()
  const encrypterSpy = new EncrypterSpy()
  const sut = new DbAddUser(
    encrypterSpy,
    addUserRepositorySpy
  )
  return {
    sut,
    encrypterSpy,
    addUserRepositorySpy
  }
}

class EncrypterSpy implements Encrypter {
  async encrypt (value: string): Promise<hash> {
    return 'any-hash'
  }
}

class AddUserRepositorySpy implements AddUserRepository {
  async add (model: AddUserModel): Promise<UserModel> {
    return {
      id: 'any-id',
      name: model.name,
      email: model.email
    }
  }
}

const makeFakeUser = (): AddUserModel => ({
  name: 'any-name',
  email: 'any-email',
  password: 'any-password'
})

describe('DbAddUser', () => {
  it('should call Encrypter with correct password', async () => {
    const { sut, encrypterSpy } = makeSut()
    const encryptSpy = jest.spyOn(encrypterSpy, 'encrypt')
    const userModel = makeFakeUser()
    await sut.add(userModel)
    expect(encryptSpy).toHaveBeenCalledWith(userModel.password)
  })

  it('should call AddUserRepository with correct values', async () => {
    const { sut, addUserRepositorySpy } = makeSut()
    const addSpy = jest.spyOn(addUserRepositorySpy, 'add')
    const userModel = makeFakeUser()
    await sut.add(userModel)
    expect(addSpy).toHaveBeenCalledWith({
      name: userModel.name,
      email: userModel.email,
      password: 'any-hash'
    })
  })

  it('should return user if AddUserRepository return user', async () => {
    const { sut } = makeSut()
    const userModel = makeFakeUser()
    const user = await sut.add(userModel)
    expect(user).toEqual({
      id: 'any-id',
      name: userModel.name,
      email: userModel.email
    })
  })

  it('should throw if any dependency throws', async () => {
    const suts = [].concat(
      new DbAddUser(
        { encrypt: () => { throw new Error() } },
        new AddUserRepositorySpy()
      ),
      new DbAddUser(
        new EncrypterSpy(),
        { add: () => { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const userModel = makeFakeUser()
      const promise = sut.add(userModel)
      void expect(promise).rejects.toThrow()
    }
  })
})
