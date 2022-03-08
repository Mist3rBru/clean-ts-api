import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers'
import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator, Validation } from '@/validation/protocols'
import { Authentication } from '@/domain/usecases'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body)
      if (error) {
        return badRequest(error)
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
      return ok({ token })
    } catch (error) {
      return serverError(error)
    }
  }
}
