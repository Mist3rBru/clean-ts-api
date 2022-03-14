import { ListSurveys } from '@/domain/usecases'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class ListSurveysController implements Controller {
  constructor (
    private readonly listSurveys: ListSurveys
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    await this.listSurveys.list()
    return null
  }
}
