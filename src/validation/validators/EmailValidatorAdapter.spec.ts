import { EmailValidatorAdapter } from './EmailValidatorAdapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (email: string): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  const sut = new EmailValidatorAdapter()
  return sut
}

describe('EmailValidatorAdapter', () => {
  it('should return false if email is invalid', async () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid-email')
    expect(isValid).toBe(false)
  })

  it('should return true if email is valid', async () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid-email')
    expect(isValid).toBe(true)
  })

  it('should call validator with correct email', async () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('valid-email')
    expect(isEmailSpy).toBeCalledWith('valid-email')
  })
})
