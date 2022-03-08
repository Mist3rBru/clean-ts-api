import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { badRequest } from '@/presentation/helpers'
import { MissingParamError } from '@/presentation/errors'

export class LoginController implements Controller {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const { email, password } = request.body
    if (!email) {
      return badRequest(new MissingParamError('email'))
    }
    if (!password) {
      return badRequest(new MissingParamError('password'))
    }
    return new Promise(resolve => '')
  }
}
