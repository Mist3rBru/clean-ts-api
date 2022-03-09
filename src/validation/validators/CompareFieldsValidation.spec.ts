import { InvalidParamError } from '@/presentation/errors'
import { CompareFieldsValidation } from '@/validation/validators'

describe('CompareFieldsValidation', () => {
  it('should return error if fields are not equal', async () => {
    const sut = new CompareFieldsValidation(['a', 'b'])
    const error = sut.validate({ a: 0, b: 1 })
    expect(error).toEqual(new InvalidParamError('b'))
  })
})
