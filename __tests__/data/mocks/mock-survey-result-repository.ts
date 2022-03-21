import { SaveSurveyResultRepository } from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/usecases'
import { SurveyResultRepository } from '@/infra/database/mongodb'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export const mockSaveSurveyResultRepository = (): SurveyResultRepository => {
  class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
    async save (survey: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }
  return new SaveSurveyResultRepositorySpy()
}
