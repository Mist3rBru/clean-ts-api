import { ListSurveys } from '@/domain/usecases'
import { noContent, ok } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class ListSurveysController implements Controller {
  constructor (
    private readonly listSurveys: ListSurveys
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const list = await this.listSurveys.list()
    return list.length ? ok(list) : noContent()
  }
}
