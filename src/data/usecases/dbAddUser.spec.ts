import { DbAddUser } from './DbAddUser'
import { Encrypter, AddUserRepository } from '@/data/protocols'
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
  async encrypt (value: string): Promise<string> {
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

describe('DbAddUser', () => {
  it('should call Encrypter with correct password', async () => {
    const { sut, encrypterSpy } = makeSut()
    const encryptSpy = jest.spyOn(encrypterSpy, 'encrypt')
    const userModel = {
      name: 'any-name',
      email: 'any-email',
      password: 'any-password'
    }
    await sut.add(userModel)
    expect(encryptSpy).toHaveBeenCalledWith(userModel.password)
  })

  it('should  call AddUserRepository with correct values', async () => {
    const { sut, addUserRepositorySpy } = makeSut()
    const addSpy = jest.spyOn(addUserRepositorySpy, 'add')
    const userModel = {
      name: 'any-name',
      email: 'any-email',
      password: 'any-password'
    }
    await sut.add(userModel)
    expect(addSpy).toHaveBeenCalledWith({
      name: userModel.name,
      email: userModel.email,
      password: 'any-hash'
    })
  })
})
