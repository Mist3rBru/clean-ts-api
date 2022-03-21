import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultSpy implements SaveSurveyResult {
    async save (model: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  return new SaveSurveyResultSpy()
}
