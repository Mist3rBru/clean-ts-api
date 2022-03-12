import { AddSurveyController } from '@/presentation/controllers'
import { MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'
import { HttpRequest } from '@/presentation/protocols'
import { Validation } from '@/validation/protocols'
import { AddSurvey, AddSurveyModel } from '@/domain/usecases'

interface SutTypes { 
  sut: AddSurveyController
  validationSpy: Validation
  addSurveySpy: AddSurvey
}

const makeSut = (): SutTypes => {
  const addSurveySpy = new AddSurveySpy()
  const validationSpy = new ValidationSpy()
  const sut = new AddSurveyController(
    validationSpy,
    addSurveySpy
  )
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
  async add (survey: AddSurveyModel): Promise<void> {}
}

const makeFakeRequest = (): HttpRequest => {
  const surveyModel: AddSurveyModel = {
    question: 'any-question',
    answers: [{
      answer: 'any-answer',
      image: 'any-image'
    }]
  }
  return {
    body: surveyModel
  }
}

describe('AddSurveyController', () => {
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
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(fakeError))
  })
  
  it('should call AddSurvey with correct values', async () => {
    const { sut, addSurveySpy } = makeSut()
    const addSpy = jest.spyOn(addSurveySpy, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    const { question, answers } = httpRequest.body
    expect(addSpy).toHaveBeenCalledWith({ question, answers })
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
        { add () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const httpRequest = makeFakeRequest()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
    }
  })
})
