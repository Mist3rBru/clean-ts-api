import { BcryptAdapter } from '@/infra/cryptography'
import bcrypt = require('bcrypt')

jest.mock('bcrypt', () => ({
  async hash (data: string, salt: number): Promise<string> {
    return 'any-hash'
  }
}))

const salt = 8
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}

describe('BcryptAdapter', () => {
  it('should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const encryptSpy = jest.spyOn(bcrypt, 'hash')
    await sut.generate('any-value')
    expect(encryptSpy).toBeCalledWith('any-value', salt)
  })

  it('should return a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.generate('any-value')
    expect(hash).toBe('any-hash')
  })

  it('should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(
      () => { throw new Error() }
    )
    const promise = sut.generate('any-value')
    void expect(promise).rejects.toThrow()
  })
})
