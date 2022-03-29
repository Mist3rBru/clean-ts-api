import { HttpRequest, HttpResponse, Controller } from '@/presentation/protocols'
import { ok, badRequest, serverError, forbidden } from '@/presentation/helpers'
import { EmailInUseError } from '@/presentation/errors'
import { Validation } from '@/validation/protocols'
import { AddUser, Authentication } from '@/domain/usecases'

export class SignUpController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addUser: AddUser,
    private readonly authentication: Authentication
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = request.body
      const user = await this.addUser.add({ name, email, password })
      if (!user) {
        return forbidden(new EmailInUseError())
      }
      const authModel = await this.authentication.auth({ email, password })
      return ok(authModel)
    } catch (error) {
      return serverError(error)
    }
  }
}
