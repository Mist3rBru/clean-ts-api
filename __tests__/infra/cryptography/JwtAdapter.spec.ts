import { JwtAdapter } from '@/infra/cryptography'
import { throwError } from '@/tests/domain/mocks'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  sign (payload: object, secret: string, options: object) {
    return 'any-token'
  },

  verify (token: string, secret: string) {
    return { id: 'any-value' }
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('any-secret')
}

describe('JwtAdapter', () => {
  describe('encrypt()', () => {
    it('should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any-value')
      expect(signSpy).toBeCalledWith(
        { id: 'any-value' },
        'any-secret',
        { expiresIn: '15m' }
      )
    })

    it('should return token when sign success', async () => {
      const sut = makeSut()
      const token = await sut.encrypt('any-value')
      expect(token).toBe('any-token')
    })

    it('should throw when sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(throwError)
      const promise = sut.encrypt('any-value')
      void expect(promise).rejects.toThrow()
    })
  })

  describe('decrypt()', () => {
    it('should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any-token')
      expect(verifySpy).toBeCalledWith('any-token', 'any-secret')
    })

    it('should return null if verify fails', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockReturnValueOnce(null)
      const value = await sut.decrypt('any-token')
      expect(value).toBeNull()
    })

    it('should return a value when verify success', async () => {
      const sut = makeSut()
      const value = await sut.decrypt('any-token')
      expect(value).toBe('any-value')
    })

    it('should throw when verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(throwError)
      const promise = sut.decrypt('any-token')
      await expect(promise).rejects.toThrow()
    })
  })
})
