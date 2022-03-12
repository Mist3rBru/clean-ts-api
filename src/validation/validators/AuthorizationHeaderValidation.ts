import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { Validation } from '@/validation/protocols'

export class CompareFieldsValidation implements Validation {
  validate(input: any): Error {
    const authHeader = input.authorization
    if (!authHeader) { 
      return new MissingParamError('token')
    }
    const parts = authHeader.split(' ')
    if (parts.length !== 2) {
      return new MissingParamError('bearer token')
    }
    if(!/^Bearer$/i.test(parts[0])) {
      return new InvalidParamError('token malformed')
    }
    return null
  }
}