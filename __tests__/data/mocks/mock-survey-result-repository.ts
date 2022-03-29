import { AddSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'
import { AddSurveyResultParams } from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class AddSurveyResultRepositorySpy implements AddSurveyResultRepository {
  survey: AddSurveyResultParams
  async add (survey: AddSurveyResultParams): Promise<void> {
    this.survey = survey
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  surveyId: string
  userId: string
  surveyResult = mockSurveyResultModel()
  async load (surveyId: string, userId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    this.userId = userId
    return this.surveyResult
  }
}
