import { EmailValidation } from '@/validation/validators'
import { InvalidParamError } from '@/presentation/errors'
import { EmailValidatorSpy } from '@/tests/validation/mocks'
import faker from '@faker-js/faker'

type SutTypes = {
  sut: EmailValidation
  emailValidatorSpy: EmailValidatorSpy
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new EmailValidation(
    'email',
    emailValidatorSpy
  )
  return {
    sut,
    emailValidatorSpy
  }
}

const mockInput = (): any => ({
  email: faker.internet.email()
})

describe('EmailValidation', () => {
  it('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorSpy } = makeSut()
    const fakeInput = mockInput()
    sut.validate(fakeInput)
    expect(emailValidatorSpy.email).toBe(fakeInput.email)
  })

  it('should return error if EmailValidator returns false', () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmail = false
    const error = sut.validate(mockInput())
    expect(error).toEqual(new InvalidParamError('email'))
  })

  it('should return null if EmailValidator returns true', () => {
    const { sut } = makeSut()
    const error = sut.validate(mockInput())
    expect(error).toBeNull()
  })

  it('should throw if EmailValidator throws', async () => {
    const sut = new EmailValidation(
      'email',
      { isValid () { throw new Error() } }
    )
    expect(sut.validate).toThrow()
  })
})
