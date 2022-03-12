import { AuthMiddleware } from '@/presentation/middlewares'
import { Validation } from '@/validation/protocols'
import { HttpRequest } from '@/presentation/protocols'

interface SutTypes { 
  sut: AuthMiddleware
  validationSpy: Validation
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = new AuthMiddleware(
    validationSpy,
  )
  return {
    sut,
    validationSpy
  }
}

class ValidationSpy implements Validation {
  validate(input: any): Error {
    return null
  }
}

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    authorization: 'any-token'
  }
})

describe('AuthMiddleware', () => {
  it('should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()
    const validateSpy = jest.spyOn(validationSpy, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toBeCalledWith(httpRequest.headers)
  })
})
