import { AddSurveyController } from '@/presentation/controllers'
import { HttpRequest } from '@/presentation/protocols'
import { Validation } from '@/validation/protocols'

interface SutTypes { 
  sut: AddSurveyController
  validationSpy: Validation
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = new AddSurveyController(
    validationSpy
  )
  return {
    sut,
    validationSpy
  }
}

class ValidationSpy implements Validation {
  validate (input: any): Error {
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
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request.body)
  })
})
