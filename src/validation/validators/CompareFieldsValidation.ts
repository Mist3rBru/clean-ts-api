import { InvalidParamError } from '@/presentation/errors'
import { Validation } from '@/validation/protocols'

export class CompareFieldsValidation implements Validation {
  constructor (
    private readonly fields: string[]
  ) {}

  validate (input: any): Error {
    const isValid = input[this.fields[0]] === input[this.fields[1]]
    return isValid ? null : new InvalidParamError(this.fields[1])
  }
}
