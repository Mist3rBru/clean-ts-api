import { SurveyResultModel } from '@/domain/models'
import { AddSurveyResult, AddSurveyResultParams, LoadSurveyResult } from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export const mockAddSurveyResult = (): AddSurveyResult => {
  class SaveSurveyResultSpy implements AddSurveyResult {
    async add (model: AddSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  return new SaveSurveyResultSpy()
}

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultSpy implements LoadSurveyResult {
    async load (surveyId: string, userId: string): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  return new LoadSurveyResultSpy()
}
