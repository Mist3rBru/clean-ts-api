import { ValidationComposite } from '@/validation/validators'
import { ValidationSpy } from '@/tests/validation/mocks'

type SutTypes = {
  sut: ValidationComposite
  validationSpies: ValidationSpy[]
}

const makeSut = (): SutTypes => {
  const validationSpies = [
    new ValidationSpy(),
    new ValidationSpy()
  ]
  const sut = new ValidationComposite(validationSpies)
  return {
    sut,
    validationSpies
  }
}

describe('ValidationComposite', () => {
  it('should call Validations with correct value', () => {
    const { sut, validationSpies } = makeSut()
    sut.validate('any-input')
    expect(validationSpies[0].input).toBe('any-input')
    expect(validationSpies[1].input).toBe('any-input')
  })

  it('should return error when first Validation returns error', () => {
    const { sut, validationSpies } = makeSut()
    validationSpies[0].error = new Error('0')
    validationSpies[1].error = new Error('1')
    const error = sut.validate('any-input')
    expect(error).toEqual(new Error('0'))
  })

  it('should return null if Validation returns no error', () => {
    const { sut } = makeSut()
    const error = sut.validate('any-input')
    expect(error).toBeNull()
  })
})
