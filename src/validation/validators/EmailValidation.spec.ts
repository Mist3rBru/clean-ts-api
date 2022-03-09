import { EmailValidation } from '@/validation/validators'
import { EmailValidator } from '@/validation/protocols'

interface SutTypes {
  sut: EmailValidation
  emailValidatorSpy: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailValidation('email', emailValidatorSpy)
  return {
    sut,
    emailValidatorSpy
  }
}

class EmailValidatorSpy implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

describe('EmailValidation', () => {
  it('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorSpy, 'isValid')
    sut.validate({ email: 'any-email' })
    expect(isValidSpy).toBeCalledWith('any-email')
  })
})
