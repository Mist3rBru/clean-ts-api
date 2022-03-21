import { AddSurveyRepository, ListSurveysRepository, FindSurveyByIdRepository } from '@/data/protocols'
import { SurveyModel } from '@/domain/models'
import { AddSurveyParams } from '@/domain/usecases'
import { mockSurveyModel, mockSurveyList } from '@/tests/domain/mocks'

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositorySpy implements AddSurveyRepository {
    async add (survey: AddSurveyParams): Promise<void> {}
  }
  return new AddSurveyRepositorySpy()
}

export const mockListSurveysRepository = (): ListSurveysRepository => {
  class ListSurveysRepositorySpy implements ListSurveysRepository {
    async list (): Promise<SurveyModel[]> {
      return mockSurveyList()
    }
  }
  return new ListSurveysRepositorySpy()
}

export const mockFindSurveyByIdRepository = (): FindSurveyByIdRepository => {
  class FindSurveyByIdRepositorySpy implements FindSurveyByIdRepository {
    async findById (id: string): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }
  return new FindSurveyByIdRepositorySpy()
}
