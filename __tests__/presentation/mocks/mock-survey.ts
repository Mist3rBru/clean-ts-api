import { SurveyModel } from '@/domain/models'
import { AddSurvey, ListSurveys, FindSurveyById, AddSurveyParams } from '@/domain/usecases'
import { mockSurveyModel, mockSurveyList } from '@/tests/domain/mocks'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveySpy implements AddSurvey {
    async add (survey: AddSurveyParams): Promise<void> {}
  }
  return new AddSurveySpy()
}

export const mockListSurveys = (): ListSurveys => {
  class ListSurveysSpy implements ListSurveys {
    async list (): Promise<SurveyModel[]> {
      return mockSurveyList()
    }
  }
  return new ListSurveysSpy()
}

export const mockFindSurveyById = (): FindSurveyById => {
  class FindSurveyByIdSpy implements FindSurveyById {
    async findById (id: string): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }
  return new FindSurveyByIdSpy()
}
