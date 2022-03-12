import { AuthMiddleware } from '@/presentation/middlewares'
import { HttpRequest } from '@/presentation/protocols'
import { badRequest } from '@/presentation/helpers'
import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/validation/protocols'

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
  
  it('should return 400 if invalid token is provided', async () => {
    const { sut, validationSpy } = makeSut()
    const fakeError = new MissingParamError('token')
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(fakeError)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(fakeError))
  })
})
