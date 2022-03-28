import { FindSurveyById, LoadSurveyResult } from '@/domain/usecases'
import { LoadSurveyResultController } from '@/presentation/controllers'
import { ok } from '@/presentation/helpers'
import { HttpRequest } from '@/presentation/protocols'
import { mockFindSurveyById, mockLoadSurveyResult } from '@/tests/presentation/mocks'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

type SutTypes = {
  sut: LoadSurveyResultController
  findSurveyByIdSpy: FindSurveyById
  loadSurveyResultSpy: LoadSurveyResult
}

const makeSut = (): SutTypes => {
  const findSurveyByIdSpy = mockFindSurveyById()
  const loadSurveyResultSpy = mockLoadSurveyResult()
  const sut = new LoadSurveyResultController(
    findSurveyByIdSpy,
    loadSurveyResultSpy
  )
  return {
    sut,
    findSurveyByIdSpy,
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
  it('should call FindSurveyById with correct values', async () => {
    const { sut, findSurveyByIdSpy } = makeSut()
    const findSpy = jest.spyOn(findSurveyByIdSpy, 'findById')
    await sut.handle(mockRequest())
    expect(findSpy).toBeCalledWith('any-survey-id')
  })

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
    const findSurveyById = mockFindSurveyById()
    const loadSurveyResult = mockLoadSurveyResult()
    const suts = [].concat(
      new LoadSurveyResultController(
        { findById () { throw new Error() } },
        loadSurveyResult
      ),
      new LoadSurveyResultController(
        findSurveyById,
        { load () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const httpResponse = await sut.handle(mockRequest())
      expect(httpResponse.statusCode).toBe(500)
    }
  })
})
