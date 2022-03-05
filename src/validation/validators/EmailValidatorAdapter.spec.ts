import { EmailValidatorAdapter } from './EmailValidatorAdapter'

const makeSut = (): EmailValidatorAdapter => {
  const sut = new EmailValidatorAdapter()
  return sut
}

describe('EmailValidatorAdapter', () => {
  it('should return false if email is valid', async () => {
    const sut = makeSut()
    const isValid = sut.isValid('invalid-email')
    expect(isValid).toBe(false)
  })
})
