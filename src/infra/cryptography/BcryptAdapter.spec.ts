import { BcryptAdapter } from './BcryptAdapter'
import bcrypt = require('bcrypt')

jest.mock('bcrypt', () => ({
  async hash (data: string, salt: number): Promise<string> {
    return 'any-hash'
  }
}))

const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(8)
  return sut
}

describe('BcryptAdapter', () => {
  it('should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const encryptSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any-data')
    expect(encryptSpy).toBeCalledWith('any-data', 8)
  })
})
