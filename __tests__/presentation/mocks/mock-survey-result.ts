import { AddSurveyResult, LoadSurveyResult } from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export class AddSurveyResultSpy implements AddSurveyResult {
  model: AddSurveyResult.Params
  survey = mockSurveyResultModel()
  async add (model: AddSurveyResult.Params): Promise<AddSurveyResult.Result> {
    this.model = model
    return this.survey
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  data: LoadSurveyResult.Params
  survey = mockSurveyResultModel()
  async load (data: LoadSurveyResult.Params): Promise<LoadSurveyResult.Result> {
    this.data = data
    return this.survey
  }
}
