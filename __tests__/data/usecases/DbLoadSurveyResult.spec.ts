import { LoadSurveyResultRepository } from '@/data/protocols'
import { DbLoadSurveyResult } from '@/data/usecases'
import { mockLoadSurveyResultRepository } from '@/tests/data/mocks'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = mockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositorySpy
  )
  return {
    sut,
    loadSurveyResultRepositorySpy
  }
}

describe('DbLoadSurveyResult', () => {
  it('should call FindSurveyResultByIdRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultRepositorySpy, 'load')
    await sut.load('any-survey-id', 'any-user-id')
    expect(loadSpy).toBeCalledWith('any-survey-id', 'any-user-id')
  })
})
