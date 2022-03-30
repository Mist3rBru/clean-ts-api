import { ListSurveys } from '@/domain/usecases'
import { noContent, ok, serverError } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class ListSurveysController implements Controller {
  constructor (
    private readonly listSurveys: ListSurveys
  ) {}

  async handle (request: ListSurveysController.Request): Promise<HttpResponse> {
    try {
      const list = await this.listSurveys.list()
      return list.length ? ok(list) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace ListSurveysController {
  export type Request = {}
}
