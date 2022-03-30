import { AddSurvey, ListSurveys, FindSurveyById } from '@/domain/usecases'
import { mockSurveyModel, mockSurveyList } from '@/tests/domain/mocks'

export class AddSurveySpy implements AddSurvey {
  data: AddSurvey.Params
  async add (data: AddSurvey.Params): Promise<void> {
    this.data = data
  }
}

export class ListSurveysSpy implements ListSurveys {
  count = 0
  surveyList = mockSurveyList()
  async list (): Promise<ListSurveys.Result> {
    this.count++
    return this.surveyList
  }
}

export class FindSurveyByIdSpy implements FindSurveyById {
  id: string
  survey = mockSurveyModel()
  async findById (id: string): Promise<FindSurveyById.Result> {
    this.id = id
    return this.survey
  }
}
