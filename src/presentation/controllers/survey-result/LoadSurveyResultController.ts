import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { FindSurveyById, LoadSurveyResult } from '@/domain/usecases'
import { ok, serverError } from '@/presentation/helpers'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly findSurveyById: FindSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = request
      const { surveyId } = request.params
      await this.findSurveyById.findById(surveyId)
      const surveyResult = await this.loadSurveyResult.load(surveyId, userId)
      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
