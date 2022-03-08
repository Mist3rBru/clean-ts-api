import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest } from '@/presentation/helpers'
import { MissingParamError, InvalidParamError } from '@/presentation/errors'
import { EmailValidator } from '@/validation/protocols'
import { Authentication } from '@/domain/usecases'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const { email, password } = request.body
    if (!email) {
      return badRequest(new MissingParamError('email'))
    }
    const isEmail = this.emailValidator.isValid(email)
    if (!isEmail) {
      return badRequest(new InvalidParamError('email'))
    }
    if (!password) {
      return badRequest(new MissingParamError('password'))
    }
    await this.authentication.auth(email, password)
    return new Promise(resolve => resolve(null))
  }
}
