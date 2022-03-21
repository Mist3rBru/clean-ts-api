import { EmailValidation } from '@/validation/validators'
import { EmailValidator } from '@/validation/protocols'
import { InvalidParamError } from '@/presentation/errors'
import { mockEmailValidator } from '@/tests/validation/mocks'

type SutTypes = {
  sut: EmailValidation
  emailValidatorSpy: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = mockEmailValidator()
  const sut = new EmailValidation('email', emailValidatorSpy)
  return {
    sut,
    emailValidatorSpy
  }
}

describe('EmailValidation', () => {
  it('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorSpy, 'isValid')
    sut.validate({ email: 'any-email' })
    expect(isValidSpy).toBeCalledWith('any-email')
  })

  it('should return error if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut()
    jest.spyOn(emailValidatorSpy, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'invalid-email' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  it('should return null if EmailValidator returns true', () => {
    const { sut } = makeSut()
    const error = sut.validate({ email: 'valid-email' })
    expect(error).toBeNull()
  })

  it('should throw if EmailValidator throws', async () => {
    const sut = new EmailValidation('email', {
      isValid () {
        throw new Error()
      }
    })
    expect(sut.validate).toThrow()
  })
})
