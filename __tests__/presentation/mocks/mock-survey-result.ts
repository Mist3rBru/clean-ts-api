import { SurveyResultModel } from '@/domain/models'
import { AddSurveyResult, AddSurveyResultParams, LoadSurveyResult } from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class AddSurveyResultSpy implements AddSurveyResult {
  model: AddSurveyResultParams
  survey = mockSurveyResultModel()
  async add (model: AddSurveyResultParams): Promise<SurveyResultModel> {
    this.model = model
    return this.survey
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  surveyId: string
  userId: string
  survey = mockSurveyResultModel()
  async load (surveyId: string, userId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId
    this.userId = userId
    return this.survey
  }
}
