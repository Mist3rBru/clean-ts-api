import { JwtAdapter } from '@/infra/cryptography'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  sign (payload: object, secret: string, options: object) {
    return 'any-token'
  }
}))

const makeSut = (): JwtAdapter => {
  const secret = 'any-secret'
  const sut = new JwtAdapter(secret)
  return sut
}

describe('JwtAdapter generate', () => {
  it('should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.generate('any-value')
    expect(signSpy).toBeCalledWith(
      { id: 'any-value' }, 'any-secret', { expiresIn: '15m' }
    )
  })

  it('should return token on sign success', async () => {
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
