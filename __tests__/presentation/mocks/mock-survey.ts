import { SurveyModel } from '@/domain/models'
import { AddSurvey, ListSurveys, FindSurveyById, AddSurveyParams } from '@/domain/usecases'
import { mockSurveyModel, mockSurveyList } from '@/tests/domain/mocks'

export class AddSurveySpy implements AddSurvey {
  survey: AddSurveyParams
  async add (survey: AddSurveyParams): Promise<void> {
    this.survey = survey
  }
}

export class ListSurveysSpy implements ListSurveys {
  count = 0
  surveyList = mockSurveyList()
  async list (): Promise<SurveyModel[]> {
    this.count++
    return this.surveyList
  }
}

export class FindSurveyByIdSpy implements FindSurveyById {
  id: string
  survey = mockSurveyModel()
  async findById (id: string): Promise<SurveyModel> {
    this.id = id
    return this.survey
  }
}
