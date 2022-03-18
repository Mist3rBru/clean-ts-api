import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from '@/validation/validators'

describe('CompareFieldsValidation', () => {
  it('should return error if provided fields are not equal', async () => {
    const sut = new CompareFieldsValidation(['a', 'b'])
    const error = sut.validate({ a: 1, b: 0 })
    expect(error).toEqual(new InvalidParamError('b'))
  })

  it('should return null if provided fields are equal', async () => {
    const sut = new CompareFieldsValidation(['a', 'b'])
    const error = sut.validate({ a: 1, b: 1 })
    expect(error).toBeNull()
  })
})
