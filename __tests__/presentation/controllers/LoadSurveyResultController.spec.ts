import { LoadSurveyResult } from '@/domain/usecases'
import { LoadSurveyResultController } from '@/presentation/controllers'
import { HttpRequest } from '@/presentation/protocols'
import { mockLoadSurveyResult } from '@/tests/presentation/mocks'

type SutTypes = {
  sut: LoadSurveyResultController
  loadSurveyResultSpy: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const loadSurveyResultSpy = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(
    loadSurveyResultSpy
  )
  return {
    sut,
    loadSurveyResultSpy
  }
}

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any-survey-id'
  },
  userId: 'any-user-id'
})

describe('LoadSurveyResultController', () => {
  it('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultSpy, 'load')
    await sut.handle(mockRequest())
    expect(loadSpy).toBeCalledWith('any-survey-id', 'any-user-id')
  })
})
