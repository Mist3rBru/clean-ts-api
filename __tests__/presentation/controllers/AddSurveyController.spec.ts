import { mockAddSurveyParams } from '@/tests/domain/mocks'
import { AddSurveyController } from '@/presentation/controllers'
import { MissingParamError } from '@/presentation/errors'
import { badRequest, noContent } from '@/presentation/helpers'
import { HttpRequest } from '@/presentation/protocols'
import { Validation } from '@/validation/protocols'
import { AddSurvey } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'
import MockDate from 'mockdate'

type SutTypes = {
  sut: AddSurveyController
  validationSpy: Validation
  addSurveySpy: AddSurvey
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

class ValidationSpy implements Validation {
  validate (input: any): Error {
    return null
  }
}

class AddSurveySpy implements AddSurvey {
  async add (survey: SurveyModel): Promise<void> {}
}

const makeFakeRequest = (): HttpRequest => ({
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
    const validateSpy = jest.spyOn(validationSpy, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    const fakeError = new MissingParamError('any-param')
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(fakeError)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(fakeError))
  })

  it('should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()
    const addSpy = jest.spyOn(addSurveySpy, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    const { question, answers, date } = httpRequest.body
    expect(addSpy).toHaveBeenCalledWith({ question, answers, date })
  })

  it('should return 500 if any dependency throws', async () => {
    const addSurvey = new AddSurveySpy()
    const validation = new ValidationSpy()
    const suts = [].concat(
      new AddSurveyController(
        { validate () { throw new Error() } },
        addSurvey
      ),
      new AddSurveyController(
        validation,
        { add () { throw new Error() } })
    )
    for (const sut of suts) {
      const httpRequest = makeFakeRequest()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
    }
  })

  it('should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
