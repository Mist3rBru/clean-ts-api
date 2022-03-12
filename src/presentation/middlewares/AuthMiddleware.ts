import { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols'
import { badRequest } from '@/presentation/helpers'
import { Validation } from '@/validation/protocols'
import { FindUserByToken } from '@/domain/usecases'

export class AuthMiddleware implements Middleware { 
  constructor(
    private readonly validation: Validation,
    private readonly findUserByToken: FindUserByToken
  ) {}
  
  async handle (request: HttpRequest): Promise<HttpResponse> { 
    const error = this.validation.validate(request.headers)
    if (error) {
      return badRequest(error)
    }
    const token = request.headers.authorization 
    await this.findUserByToken.find(token)
    return null
  }
}
