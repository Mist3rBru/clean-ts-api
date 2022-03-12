import { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols'
import { badRequest, forbidden } from '@/presentation/helpers'
import { Validation } from '@/validation/protocols'
import { FindUserByToken } from '@/domain/usecases'
import { AccessDeniedError } from '@/presentation/errors'

export class AuthMiddleware implements Middleware { 
  constructor(
    private readonly validation: Validation,
    private readonly findUserByToken: FindUserByToken,
    private readonly role?: string
  ) {}
  
  async handle (request: HttpRequest): Promise<HttpResponse> { 
    const error = this.validation.validate(request.headers)
    if (error) {
      return badRequest(error)
    }
    const token = request.headers.authorization 
    const user = await this.findUserByToken.find(token, this.role)
    if (!user) {
      return forbidden(new AccessDeniedError())
    }
    return null
  }
}
