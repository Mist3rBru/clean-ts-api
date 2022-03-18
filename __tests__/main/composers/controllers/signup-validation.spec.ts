import { CompareFieldsValidation, EmailValidation, EmailValidatorAdapter, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { makeSignUpValidation } from '@/main/composers/controllers'
import { Validation } from '@/validation/protocols'

jest.mock('@/validation/validators/ValidationComposite')

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', async () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation(['password', 'passwordConfirmation']))
    const emailValidator = new EmailValidatorAdapter()
    validations.push(new EmailValidation('email', emailValidator))
    expect(ValidationComposite).toBeCalledWith(validations)
  })
})
