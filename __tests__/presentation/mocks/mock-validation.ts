import { Validation } from '@/validation/protocols'

export class ValidationSpy implements Validation {
  input: any
  error = null
  validate (input: any): Error {
    this.input = input
    return this.error
  }
}
