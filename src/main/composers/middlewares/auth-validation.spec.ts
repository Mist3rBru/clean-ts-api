import { makeAuthMiddlewareValidation } from '@/main/composers'
import { Validation } from '@/validation/protocols'
import { AuthorizationHeaderValidation, ValidationComposite } from '@/validation/validators'

jest.mock('@/validation/validators/ValidationComposite')

describe('AuthMiddlewareValidation', () => {
  it('should call ValidationComposite with all validations', async () => {
    makeAuthMiddlewareValidation()
    const validations: Validation[] = []
    validations.push(new AuthorizationHeaderValidation())
    expect(ValidationComposite).toBeCalledWith(validations)
  })
})
