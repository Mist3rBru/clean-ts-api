import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LoadSurveyResult } from '@/domain/usecases'
import { ok, serverError } from '@/presentation/helpers'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = request
      const { surveyId } = request.params
      const surveyResult = await this.loadSurveyResult.load(surveyId, userId)
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
