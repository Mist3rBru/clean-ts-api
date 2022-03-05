import { DbAddUser } from './DbAddUser'
import { Encrypter } from '@/data/protocols'

interface SutTypes {
  sut: DbAddUser
  encrypterSpy: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterSpy = new EncrypterSpy()
  const sut = new DbAddUser(
    encrypterSpy
  )
  return {
    sut,
    encrypterSpy
  }
}

class EncrypterSpy {
  async encrypt (value: string): Promise<string> {
    return 'any-hash'
  }
}

describe('DbAddUser', () => {
  it('should call Encrypter ', async () => {
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
})
