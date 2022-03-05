import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../protocols'
import { MissingParamError, InvalidParamError } from '@/utils/errors'
import { badRequest } from '@/utils/helpers'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['name', 'email', 'password', 'password_confirmation']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const isEmailValid = this.emailValidator.isValid(httpRequest.body.email)
    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}
