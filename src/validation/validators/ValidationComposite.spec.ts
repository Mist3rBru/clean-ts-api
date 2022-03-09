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
})
