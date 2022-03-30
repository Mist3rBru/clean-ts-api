import { FindSurveyById, AddSurveyResult } from '@/domain/usecases'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class AddSurveyResultController implements Controller {
  constructor (
    private readonly findSurveyById: FindSurveyById,
    private readonly addSurveyResult: AddSurveyResult
  ) {}

  async handle (request: AddSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { userId, surveyId, answer } = request
      const survey = await this.findSurveyById.findById(surveyId)
      if (!survey) {
        return forbidden(new InvalidParamError('survey id'))
      }
      const answers = survey.answers.map(a => a.answer)
      if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'))
      }
      const updatedSurvey = await this.addSurveyResult.add({
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

export namespace AddSurveyResultController {
  export type Request = {
    userId: string
    surveyId: string
    answer: string
  }
}
