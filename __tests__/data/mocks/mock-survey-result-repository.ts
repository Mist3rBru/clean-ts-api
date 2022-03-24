import { AddSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'
import { AddSurveyResultParams } from '@/domain/usecases'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

export const mockAddSurveyResultRepository = (): AddSurveyResultRepository => {
  class AddSurveyResultRepositorySpy implements AddSurveyResultRepository {
    async add (survey: AddSurveyResultParams): Promise<void> {}
  }
  return new AddSurveyResultRepositorySpy()
}

export const mockLoadSurveyResultRepository = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
    async load (surveyId: string, userId: string): Promise<SurveyResultModel> {
      const mock = mockSurveyResultModel()
      return Object.assign(mock, { surveyId })
    }
  }
  return new LoadSurveyResultRepositorySpy()
}
