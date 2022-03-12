import { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols'
import { badRequest, forbidden } from '@/presentation/helpers'
import { AccessDeniedError } from '@/presentation/errors'
import { TokenValidator } from '@/data/protocols'
import { Validation } from '@/validation/protocols'

export class AuthMiddleware implements Middleware { 
  constructor(
    private readonly validation: Validation,
  ) {}
  
  async handle (request: HttpRequest): Promise<HttpResponse> { 
    this.validation.validate(request.headers)
    return null
  }
}
