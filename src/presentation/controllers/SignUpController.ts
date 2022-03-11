import { HttpRequest, HttpResponse, Controller } from '@/presentation/protocols'
import { ok, badRequest, serverError } from '@/presentation/helpers'
import { Validation } from '@/validation/protocols'
import { AddUser, Authentication } from '@/domain/usecases'

export class SignUpController implements Controller {
  constructor (
    private readonly addUser: AddUser,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body)
      if (error) return badRequest(error)
      const { name, email, password } = request.body
      const user = await this.addUser.add({ name, email, password })
      await this.authentication.auth({ email, password })
      return ok(user)
    } catch (error) {
      return serverError(error)
    }
  }
}
