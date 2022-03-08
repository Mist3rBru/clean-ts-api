import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest } from '@/presentation/helpers'
import { MissingParamError } from '@/presentation/errors'
import { EmailValidator } from '@/validation/protocols'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const { email, password } = request.body
    if (!email) {
      return badRequest(new MissingParamError('email'))
    }
    this.emailValidator.isValid(email)
    if (!password) {
      return badRequest(new MissingParamError('password'))
    }
    return new Promise(resolve => resolve(null))
  }
}
