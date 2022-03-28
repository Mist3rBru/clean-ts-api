import { LoadSurveyResult } from '@/domain/usecases'
import { LoadSurveyResultController } from '@/presentation/controllers'
import { ok } from '@/presentation/helpers'
import { HttpRequest } from '@/presentation/protocols'
import { mockLoadSurveyResult } from '@/tests/presentation/mocks'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

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

  it('should return survey result on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })

  it('should return 500 if any dependency throws', async () => {
    const suts = [].concat(
      new LoadSurveyResultController(
        { load () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const httpResponse = await sut.handle(mockRequest())
      expect(httpResponse.statusCode).toBe(500)
    }
  })
})
