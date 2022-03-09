import { ValidationComposite } from '@/validation/validators'
import { Validation } from '@/validation/protocols'

interface SutTypes {
  sut: ValidationComposite
  validationSpy: Validation
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = new ValidationComposite([
    validationSpy,
    validationSpy
  ])
  return {
    sut,
    validationSpy
  }
}

class ValidationSpy implements Validation {
  validate (input: any): Error {
    return null
  }
}

describe('ValidationComposite', () => {
  it('should call Validation with correct values', () => {
    const { sut, validationSpy } = makeSut()
    const validateSpy = jest.spyOn(validationSpy, 'validate')
    sut.validate('any-input')
    expect(validateSpy).toBeCalledWith('any-input')
    expect(validateSpy).toBeCalledTimes(2)
  })

  it('should return error if Validation returns error', () => {
    const { sut, validationSpy } = makeSut()
    const fakeError = new Error('any')
    const validateSpy = jest.spyOn(validationSpy, 'validate')
    validateSpy.mockReturnValueOnce(fakeError)
    const error = sut.validate('any-input')
    expect(error).toBe(fakeError)
    expect(validateSpy).toBeCalledTimes(1)
  })

  it('should return null if Validation returns no error', () => {
    const { sut } = makeSut()
    const error = sut.validate('any-input')
    expect(error).toBeNull()
  })
})
