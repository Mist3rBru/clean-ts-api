import { makeLoginValidation } from '@/main/composers'
import { Validation } from '@/validation/protocols'
import { EmailValidation, EmailValidatorAdapter, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

jest.mock('@/validation/validators/ValidationComposite')

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', async () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    const emailValidator = new EmailValidatorAdapter()
    validations.push(new EmailValidation('email', emailValidator))
    expect(ValidationComposite).toBeCalledWith(validations)
  })
})
