import { JwtAdapter } from '@/infra/cryptography'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  sign (payload: object, secret: string, options: object) {
    return 'any-token'
  },

  verify (token: string, secret: string) {
    return 'any-value'
  }
}))

const makeSut = (): JwtAdapter => {
  const secret = 'any-secret'
  const sut = new JwtAdapter(secret)
  return sut
}

describe('JwtAdapter', () => {
  describe('sign()', () => {
    it('should call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.generate('any-value')
      expect(signSpy).toBeCalledWith(
        { id: 'any-value' }, 'any-secret', { expiresIn: '15m' }
      )
    })

    it('should return token when sign success', async () => {
      const sut = makeSut()
      const token = await sut.generate('any-value')
      expect(token).toBe('any-token')
    })

    it('should throw when sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(
        () => { throw new Error() }
      )
      const promise = sut.generate('any-value')
      void expect(promise).rejects.toThrow()
    })
  })

  describe('validate()', () => {
    it('should call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.validate('any-token')
      expect(verifySpy).toBeCalledWith('any-token', 'any-secret')
    })

    it('should return a value when verify success', async () => {
      const sut = makeSut()
      const value = await sut.validate('any-token')
      expect(value).toBe('any-value')
    })

    it('should throw when verify throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(
        () => { throw new Error() }
      )
      const promise = sut.validate('any-token')
      void expect(promise).rejects.toThrow()
    })
  })
})
