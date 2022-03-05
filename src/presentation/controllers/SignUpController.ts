import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../protocols'
import { MissingParamError, InvalidParamError } from '@/utils/errors'
import { badRequest, serverError } from '@/utils/helpers'
import { AddUser } from '@/domain/usecases'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addUser: AddUser
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'password_confirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, password_confirmation: passwordConfirmation } = httpRequest.body
      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('password confirmation'))
      }
      this.addUser.add({
        name,
        email,
        password
      })
    } catch (error) {
      return serverError()
    }
  }
}
