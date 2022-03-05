import { DbAddUser } from './DbAddUser'

interface SutTypes {
  sut: DbAddUser
  encrypterSpy: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterSpy = new Encrypter()
  const sut = new DbAddUser(
    encrypterSpy
  )
  return {
    sut,
    encrypterSpy
  }
}

class Encrypter {
  async hash (value: string): Promise<string> {
    return 'any-hash'
  }
}

describe('DbAddUser', () => {
  it('should call Encrypter ', async () => {
    const { sut, encrypterSpy } = makeSut()
    const hashSpy = jest.spyOn(encrypterSpy, 'hash')
    const userModel = {
      name: 'any-name',
      email: 'any-email',
      password: 'any-password'
    }
    await sut.add(userModel)
    expect(hashSpy).toHaveBeenCalledWith(userModel.password)
  })
})
