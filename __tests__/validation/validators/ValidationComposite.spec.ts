import { ValidationComposite } from '@/validation/validators'
import { Validation } from '@/validation/protocols'
import { mockValidation } from '@/tests/validation/mocks'

type SutTypes = {
  sut: ValidationComposite
  validationSpies: Validation[]
}

const makeSut = (): SutTypes => {
  const validationSpies = [mockValidation(), mockValidation()]
  const sut = new ValidationComposite(validationSpies)
  return {
    sut,
    validationSpies
  }
}

describe('ValidationComposite', () => {
  it('should call Validations with correct value', () => {
    const { sut, validationSpies } = makeSut()
    const firstValidateSpy = jest.spyOn(validationSpies[0], 'validate')
    const secondValidateSpy = jest.spyOn(validationSpies[1], 'validate')
    sut.validate('any-input')
    expect(firstValidateSpy).toBeCalledWith('any-input')
    expect(secondValidateSpy).toBeCalledWith('any-input')
  })

  it('should return error when first Validation returns error', () => {
    const { sut, validationSpies } = makeSut()
    jest
      .spyOn(validationSpies[0], 'validate')
      .mockReturnValueOnce(new Error('0'))
    jest
      .spyOn(validationSpies[1], 'validate')
      .mockReturnValueOnce(new Error('1'))
    const error = sut.validate('any-input')
    expect(error).toEqual(new Error('0'))
  })

  it('should return null if Validation returns no error', () => {
    const { sut } = makeSut()
    const error = sut.validate('any-input')
    expect(error).toBeNull()
  })
})
