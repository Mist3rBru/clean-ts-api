import { InvalidParamError } from '@/presentation/errors'
import { HttpRequest, HttpResponse, Controller } from '@/presentation/protocols'
import { ok, badRequest, serverError } from '@/presentation/helpers'
import { EmailValidator, Validation } from '@/validation/protocols'
import { AddUser } from '@/domain/usecases'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addUser: AddUser,
    private readonly validation: Validation
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request.body)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password } = request.body
      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const user = await this.addUser.add({
        name,
        email,
        password
      })
      return ok(user)
    } catch (error) {
      return serverError(error)
    }
  }
}
