import { mockAddSurveyParams } from '@/tests/domain/mocks'
import { AddSurveyController } from '@/presentation/controllers'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, noContent } from '@/presentation/helpers'
import { HttpRequest } from '@/presentation/protocols'
import { AddSurveySpy, ValidationSpy } from '@/tests/presentation/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: AddSurveyController
  validationSpy: ValidationSpy
  addSurveySpy: AddSurveySpy
}

const makeSut = (): SutTypes => {
  const addSurveySpy = new AddSurveySpy()
  const validationSpy = new ValidationSpy()
  const sut = new AddSurveyController(validationSpy, addSurveySpy)
  return {
    sut,
    validationSpy,
    addSurveySpy
  }
}

const mockRequest = (): HttpRequest => ({
  body: mockAddSurveyParams()
})

describe('AddSurveyController', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validationSpy.input).toEqual(httpRequest.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    const fakeError = new MissingParamError('any-param')
    validationSpy.error = fakeError
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(fakeError))
  })

  it('should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    const { question, answers, date } = httpRequest.body
    expect(addSurveySpy.survey).toEqual({ question, answers, date })
  })

  it('should return 500 if any dependency throws', async () => {
    const addSurveySpy = new AddSurveySpy()
    const validationSpy = new ValidationSpy()
    const suts = [].concat(
      new AddSurveyController(
        { validate () { throw new Error() } },
        addSurveySpy
      ),
      new AddSurveyController(
        validationSpy,
        { add () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const httpRequest = mockRequest()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
    }
  })

  it('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
