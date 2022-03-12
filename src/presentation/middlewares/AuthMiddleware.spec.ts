import { AuthMiddleware } from '@/presentation/middlewares'
import { HttpRequest } from '@/presentation/protocols'
import { badRequest, forbidden } from '@/presentation/helpers'
import { AccessDeniedError, MissingParamError } from '@/presentation/errors'
import { Validation } from '@/validation/protocols'
import { FindUserByToken } from '@/domain/usecases'
import { UserModel } from '@/domain/models'

interface SutTypes { 
  sut: AuthMiddleware
  validationSpy: Validation
  findUserByTokenSpy: FindUserByToken
}

const makeSut = (): SutTypes => {
  const findUserByTokenSpy = new FindUserByTokenSpy()
  const validationSpy = new ValidationSpy()
  const sut = new AuthMiddleware(
    validationSpy,
    findUserByTokenSpy,
    'admin'
  )
  return {
    sut,
    validationSpy,
    findUserByTokenSpy
  }
}

class ValidationSpy implements Validation {
  validate(input: any): Error {
    return null
  }
}

class FindUserByTokenSpy implements FindUserByToken {
  async find(token: string, role?: string): Promise<UserModel> {
    const user = {
       id: 'any-id',
       name: 'any-name',
       email: 'any-email',
       password: 'any-password'
    }
    return user
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
  
  it('should call FindUserByToken with correct value', async () => {
    const { sut, findUserByTokenSpy } = makeSut()
    const findSpy = jest.spyOn(findUserByTokenSpy, 'find')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(findSpy).toBeCalledWith('any-token', 'admin')
  })
  
  it('should return 403 if FindUserByToken returns null', async () => {
    const { sut, findUserByTokenSpy } = makeSut()
    const fakeError = new MissingParamError('token')
    jest.spyOn(findUserByTokenSpy, 'find').mockReturnValueOnce(null)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
