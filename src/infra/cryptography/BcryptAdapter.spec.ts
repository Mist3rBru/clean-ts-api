import { BcryptAdapter } from '@/infra/cryptography'
import bcrypt = require('bcrypt')

jest.mock('bcrypt', () => ({
  async hash (data: string, salt: number): Promise<string> {
    return 'any-hash'
  },

  async compare (value: string, hash: string): Promise<boolean> {
    return true
  }
}))

const salt = 8
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt)
  return sut
}

describe('BcryptAdapter generate', () => {
  it('should call generate with correct values', async () => {
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

describe('BcryptAdapter validate', () => {
  it('should call validate with correct values', async () => {
    const sut = makeSut()
    const validateSpy = jest.spyOn(bcrypt, 'compare')
    await sut.validate('any-value', 'any-hash')
    expect(validateSpy).toBeCalledWith('any-value', 'any-hash')
  })
  
  it('should return true if valid params are provided', async () => {
    const sut = makeSut()
    const isValid = await sut.validate('valid-value', 'valid-hash')
    expect(isValid).toBe(true)
  })
  
  it('should return false if invalid params are provided', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(
      () => false
    )
    const isValid = await sut.validate('invalid-value', 'invalid-hash')
    expect(isValid).toBe(false)
  })
})
