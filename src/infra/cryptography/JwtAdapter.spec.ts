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
  it('should call sign with correct values ', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.generate('any-value')
    expect(signSpy).toBeCalledWith(
      { id: 'any-value' }, 'any-secret', { expiresIn: '15m' }
    )
  })
})
