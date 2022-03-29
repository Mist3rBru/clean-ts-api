import { AddSurveyRepository, ListSurveysRepository, FindSurveyByIdRepository } from '@/data/protocols'
import { SurveyModel } from '@/domain/models'
import { AddSurveyParams } from '@/domain/usecases'
import { mockSurveyModel, mockSurveyList } from '@/tests/domain/mocks'

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  survey: AddSurveyParams
  async add (survey: AddSurveyParams): Promise<void> {
    this.survey = survey
  }
}

export class ListSurveysRepositorySpy implements ListSurveysRepository {
  count = 0
  surveyList = mockSurveyList()
  async list (): Promise<SurveyModel[]> {
    this.count++
    return this.surveyList
  }
}

export class FindSurveyByIdRepositorySpy implements FindSurveyByIdRepository {
  id: string
  survey = mockSurveyModel()
  async findById (id: string): Promise<SurveyModel> {
    this.id = id
    return this.survey
  }
}
