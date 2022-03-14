import { Validation } from '@/validation/protocols'
import { ValidationComposite, AuthorizationHeaderValidation } from '@/validation/validators'

export const makeAuthMiddlewareValidation = (): Validation => {
  const validations: Validation[] = []
  validations.push(new AuthorizationHeaderValidation())
  return new ValidationComposite(validations)
}
