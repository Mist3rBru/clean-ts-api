import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { Validation } from '@/validation/protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}
  
  async handle (request: HttpRequest): Promise<HttpResponse> {
    this.validation.validate(request.body)
    return null
  }
}
