import { FindSurveyById, SaveSurveyResult } from '@/domain/usecases'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly findSurveyById: FindSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = request
      const { surveyId } = request.params
      const { answer } = request.body
      const survey = await this.findSurveyById.findById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('survey id'))
      }
      const answers = survey.answers.map(a => a.answer)
      if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'))
      }
      const updatedSurvey = await this.saveSurveyResult.save({
        userId: userId,
        surveyId: surveyId,
        answer: answer,
        date: new Date()
      })
      return ok(updatedSurvey)
    } catch (error) {
      return serverError(error)
    }
  }
}
