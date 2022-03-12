import { AddSurveyController } from '@/presentation/controllers'
import { MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'
import { HttpRequest } from '@/presentation/protocols'
import { Validation } from '@/validation/protocols'
import { AddSurvey, AddSurveyModel } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'

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
  async add (survey: AddSurveyModel): Promise<SurveyModel> { 
    return null
  }
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      img: 'any-img',
      question: 'any-question'
    }
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
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
