import { makeSignUpValidation } from '@/main/composers'
import { Validation } from '@/validation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'

jest.mock('@/validation/validators/ValidationComposite')

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', async () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toBeCalledWith(validations)
  })
})
