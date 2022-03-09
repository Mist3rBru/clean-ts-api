import { RequiredFieldValidation } from './RequiredFieldValidation'
import { MissingParamError } from '@/presentation/errors'

describe('RequiredFieldValidation', () => {
  it('should return error if required field is not provided', async () => {
    const sut = new RequiredFieldValidation('email')
    const error = sut.validate({ name: 'any-name' })
    expect(error).toEqual(new MissingParamError('email'))
  })
})
