import { CompareFieldsValidation, EmailValidation, EmailValidatorAdapter, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { Validation } from '@/validation/protocols'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation(['password', 'passwordConfirmation']))
  const emailValidator = new EmailValidatorAdapter()
  validations.push(new EmailValidation('email', emailValidator))
  return new ValidationComposite(validations)
}
