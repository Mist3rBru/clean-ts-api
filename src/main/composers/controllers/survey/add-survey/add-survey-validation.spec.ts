import { makeAddSurveyValidation } from '@/main/composers'
import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { Validation } from '@/validation/protocols'

jest.mock('@/validation/validators/ValidationComposite')

describe('AddSurveyValidation', () => {
  it('should call ValidationComposite with all validations', async () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toBeCalledWith(validations)
  })
})
