import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, unauthorized } from '@/presentation/helpers'
import { MissingParamError, InvalidParamError } from '@/presentation/errors'
import { EmailValidator } from '@/validation/protocols'
import { Authentication } from '@/domain/usecases'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
    const { email, password } = request.body
    const isEmailValid = this.emailValidator.isValid(email)
    if (!isEmailValid) {
      return badRequest(new InvalidParamError('email'))
    }
    const token = await this.authentication.auth(email, password)
    if (!token) {
      return unauthorized()
    }
    return new Promise(resolve => resolve(null))
  }
}
