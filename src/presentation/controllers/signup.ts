import { badRequest } from '@/utils/helpers'
import { MissingParamError } from '@/utils/errors'
export class Signup {
  async handle (httpRequest: any): Promise<any> {
    const requiredParams = ['name', 'email', 'password', 'password_confirmation']
    for (const param of requiredParams) {
      if (!httpRequest[param]) {
        return badRequest(new MissingParamError(param))
      }
    }
  }
}
