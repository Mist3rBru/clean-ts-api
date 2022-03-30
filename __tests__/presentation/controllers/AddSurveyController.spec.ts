import { mockAddSurveyParams } from '@/tests/domain/mocks'
import { AddSurveyController } from '@/presentation/controllers'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, noContent } from '@/presentation/helpers'
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

const mockRequest = (): AddSurveyController.Request => mockAddSurveyParams()

describe('AddSurveyController', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
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
    const request = mockRequest()
    await sut.handle(request)
    const { question, answers } = request
    expect(addSurveySpy.data).toEqual({ question, answers, date: new Date() })
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
      const request = mockRequest()
      const httpResponse = await sut.handle(request)
      expect(httpResponse.statusCode).toBe(500)
    }
  })

  it('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
