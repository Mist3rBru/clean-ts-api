import { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols'
import { badRequest } from '@/presentation/helpers'
import { Validation } from '@/validation/protocols'

export class AuthMiddleware implements Middleware { 
  constructor(
    private readonly validation: Validation,
  ) {}
  
  async handle (request: HttpRequest): Promise<HttpResponse> { 
    const error = this.validation.validate(request.headers)
    if (error) {
      return badRequest(error)
    }
    return null
  }
}
