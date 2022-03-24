import { SurveyResultModel } from '@/domain/models'
import { AddSurveyResult, AddSurveyResultParams } from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export const mockAddSurveyResult = (): AddSurveyResult => {
  class SaveSurveyResultSpy implements AddSurveyResult {
    async add (model: AddSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  return new SaveSurveyResultSpy()
}
