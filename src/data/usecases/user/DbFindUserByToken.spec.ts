import { Decrypter } from '@/data/protocols'
import { DbFindUserByToken } from '@/data/usecases'

interface SutTypes {
  sut: DbFindUserByToken
  decrypterSpy: Decrypter
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const sut = new DbFindUserByToken(
    decrypterSpy
  )
  return {
    sut,
    decrypterSpy
  }
}

class DecrypterSpy implements Decrypter {
  async decrypt (token: string): Promise<string> {
    return 'any-id'
  }
}

describe('DbFindUserByToken', () => {
  it('should call Decrypter with correct value', async () => {
    const { sut, decrypterSpy } = makeSut()
    const decryptSpy = jest.spyOn(decrypterSpy, 'decrypt')
    await sut.find('any-token')
    expect(decryptSpy).toBeCalledWith('any-token')
  })
})
