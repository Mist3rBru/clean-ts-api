import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers'
import { Validation } from '@/validation/protocols'
import { Authentication } from '@/domain/usecases'

export class LoginController implements Controller {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const credentials = request.body
      const error = this.validation.validate(credentials)
      if (error) {
        return badRequest(error)
      }
      const token = await this.authentication.auth(credentials)
      if (!token) {
        return unauthorized()
      }
      return ok({ token })
    } catch (error) {
      return serverError(error)
    }
  }
}
