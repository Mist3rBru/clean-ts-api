import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LoadSurveyResult } from '@/domain/usecases'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    const { userId } = request
    const { surveyId } = request.params
    await this.loadSurveyResult.load(surveyId, userId)
    return null
  }
}
