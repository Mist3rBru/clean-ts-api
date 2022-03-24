import { AddSurveyResultRepository, FindSurveyResultByIdRepository } from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'
import { AddSurveyResultParams } from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export const mockAddSurveyResultRepository = (): AddSurveyResultRepository => {
  class AddSurveyResultRepositorySpy implements AddSurveyResultRepository {
    async add (survey: AddSurveyResultParams): Promise<void> {}
  }
  return new AddSurveyResultRepositorySpy()
}

export const mockFindSurveyResultByIdRepository = (): FindSurveyResultByIdRepository => {
  class FindSurveyResultByIdRepositorySpy implements FindSurveyResultByIdRepository {
    async findById (surveyId: string, userId: string): Promise<SurveyResultModel> {
      const mock = mockSurveyResultModel()
      return Object.assign(mock, { surveyId })
    }
  }
  return new FindSurveyResultByIdRepositorySpy()
}
