import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok } from '@/presentation/helpers'
import { HttpRequest } from '@/presentation/protocols'
import { AddSurveyResultController } from '@/presentation/controllers'
import { AddSurveyResultSpy, FindSurveyByIdSpy } from '@/tests/presentation/mocks'
import faker from '@faker-js/faker'
import MockDate from 'mockdate'

type SutTypes = {
  sut: AddSurveyResultController
  findSurveyByIdSpy: FindSurveyByIdSpy
  addSurveyResultSpy: AddSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const addSurveyResultSpy = new AddSurveyResultSpy()
  const findSurveyByIdSpy = new FindSurveyByIdSpy()
  const sut = new AddSurveyResultController(
    findSurveyByIdSpy,
    addSurveyResultSpy
  )
  return {
    sut,
    findSurveyByIdSpy,
    addSurveyResultSpy
  }
}

const mockRequest = (survey: any = null): HttpRequest => ({
  params: {
    surveyId: faker.datatype.uuid()
  },
  body: {
    answer: survey?.answers[0].answer
  },
  userId: faker.datatype.uuid()
})

describe('SaveSurveyResultController', () => {
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
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('survey id')))
  })

  it('should return 403 if invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = mockRequest()
    httpRequest.body.answer = 'invalid-answer'
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  it('should call SaveSurveyResult with correct values', async () => {
    const { sut, addSurveyResultSpy, findSurveyByIdSpy } = makeSut()
    const httpRequest = mockRequest(findSurveyByIdSpy.survey)
    await sut.handle(httpRequest)
    expect(addSurveyResultSpy.model).toEqual({
      userId: httpRequest.userId,
      surveyId: httpRequest.params.surveyId,
      answer: httpRequest.body.answer,
      date: new Date()
    })
  })

  it('should return 200 on success', async () => {
    const { sut, addSurveyResultSpy, findSurveyByIdSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest(findSurveyByIdSpy.survey))
    expect(httpResponse).toEqual(ok(addSurveyResultSpy.survey))
  })

  it('should return 500 if any dependency throws', async () => {
    const findSurveyByIdSpy = new FindSurveyByIdSpy()
    const addSurveyResultSpy = new AddSurveyResultSpy()
    const suts = [].concat(
      new AddSurveyResultController(
        { findById () { throw new Error() } },
        addSurveyResultSpy
      ),
      new AddSurveyResultController(
        findSurveyByIdSpy,
        { add () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const httpResponse = await sut.handle(mockRequest(findSurveyByIdSpy.survey))
      expect(httpResponse.statusCode).toBe(500)
    }
  })
})
