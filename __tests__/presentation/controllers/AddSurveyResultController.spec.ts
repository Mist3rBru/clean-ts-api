import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok } from '@/presentation/helpers'
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

const mockRequest = (survey: any = null): AddSurveyResultController.Request => ({
  userId: faker.datatype.uuid(),
  surveyId: faker.datatype.uuid(),
  answer: survey?.answers[0].answer
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
    const request = mockRequest()
    await sut.handle(request)
    expect(findSurveyByIdSpy.id).toBe(request.surveyId)
  })

  it('should return 403 if FindSurveyById returns null', async () => {
    const { sut, findSurveyByIdSpy } = makeSut()
    findSurveyByIdSpy.survey = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('survey id')))
  })

  it('should return 403 if invalid answer is provided', async () => {
    const { sut } = makeSut()
    const request = mockRequest()
    request.answer = 'invalid-answer'
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  it('should call SaveSurveyResult with correct values', async () => {
    const { sut, addSurveyResultSpy, findSurveyByIdSpy } = makeSut()
    const request = mockRequest(findSurveyByIdSpy.survey)
    await sut.handle(request)
    expect(addSurveyResultSpy.model).toEqual({ ...request, date: new Date() })
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
