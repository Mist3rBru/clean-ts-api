import { LoadSurveyResultController } from '@/presentation/controllers'
import { forbidden, ok } from '@/presentation/helpers'
import { HttpRequest } from '@/presentation/protocols'
import { InvalidParamError } from '@/presentation/errors'
import { FindSurveyByIdSpy, LoadSurveyResultSpy } from '@/tests/presentation/mocks'
import faker from '@faker-js/faker'
import MockDate from 'mockdate'

type SutTypes = {
  sut: LoadSurveyResultController
  findSurveyByIdSpy: FindSurveyByIdSpy
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const findSurveyByIdSpy = new FindSurveyByIdSpy()
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
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
    surveyId: faker.datatype.uuid()
  },
  userId: faker.datatype.uuid()
})

describe('LoadSurveyResultController', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  it('should call FindSurveyById with correct values', async () => {
    const { sut, findSurveyByIdSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(findSurveyByIdSpy.id).toBe(httpRequest.params.surveyId)
  })

  it('should return 403 if FindSurveyById returns null', async () => {
    const { sut, findSurveyByIdSpy } = makeSut()
    findSurveyByIdSpy.survey = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadSurveyResultSpy.surveyId).toBe(httpRequest.params.surveyId)
    expect(loadSurveyResultSpy.userId).toBe(httpRequest.userId)
  })

  it('should return survey result on success', async () => {
    const { sut, loadSurveyResultSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(loadSurveyResultSpy.survey))
  })

  it('should return 500 if any dependency throws', async () => {
    const findSurveyByIdSpy = new FindSurveyByIdSpy()
    const loadSurveyResultSpy = new LoadSurveyResultSpy()
    const suts = [].concat(
      new LoadSurveyResultController(
        { findById () { throw new Error() } },
        loadSurveyResultSpy
      ),
      new LoadSurveyResultController(
        findSurveyByIdSpy,
        { load () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const httpResponse = await sut.handle(mockRequest())
      expect(httpResponse.statusCode).toBe(500)
    }
  })
})
