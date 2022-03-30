import { AddSurveyRepository, ListSurveysRepository, FindSurveyByIdRepository } from '@/data/protocols'
import { mockSurveyModel, mockSurveyList } from '@/tests/domain/mocks'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  data: AddSurveyRepository.Params
  async add (data: AddSurveyRepository.Params): Promise<void> {
    this.data = data
  }
}

export class ListSurveysRepositorySpy implements ListSurveysRepository {
  count = 0
  surveyList = mockSurveyList()
  async list (): Promise<ListSurveysRepository.Result> {
    this.count++
    return this.surveyList
  }
}

export class FindSurveyByIdRepositorySpy implements FindSurveyByIdRepository {
  id: string
  survey = mockSurveyModel()
  async findById (id: string): Promise<FindSurveyByIdRepository.Result> {
    this.id = id
    return this.survey
  }
}
