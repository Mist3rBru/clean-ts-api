import { MissingParamError } from '@/presentation/errors'
import { AuthorizationHeaderValidation } from '@/validation/validators'

const makeSut = (): AuthorizationHeaderValidation => {
  const sut = new AuthorizationHeaderValidation()
  return sut
}

describe('AuthorizationHeaderValidation', () => {
  it('should return error if no authorization header is provided', async () => {
    const sut = makeSut()
    const error = sut.validate({ authorization: null })
    expect(error).toEqual(new MissingParamError('token'))
  })
})
