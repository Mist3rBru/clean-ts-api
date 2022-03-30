import { AddSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class AddSurveyResultRepositorySpy implements AddSurveyResultRepository {
  data: AddSurveyResultRepository.Params
  async add (data: AddSurveyResultRepository.Params): Promise<void> {
    this.data = data
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  data: LoadSurveyResultRepository.Params
  surveyResult = mockSurveyResultModel()
  async load (data: LoadSurveyResultRepository.Params): Promise<LoadSurveyResultRepository.Result> {
    this.data = data
    return this.surveyResult
  }
}
