import { AuthMiddleware } from '@/presentation/middlewares'
import { HttpRequest } from '@/presentation/protocols'
import { badRequest, forbidden, ok } from '@/presentation/helpers'
import { AccessDeniedError, MissingParamError } from '@/presentation/errors'
import { Validation } from '@/validation/protocols'
import { FindUserByToken } from '@/domain/usecases'
import { UserModel } from '@/domain/models'
import { mockUserModel } from '@/tests/domain/mocks'

type SutTypes = {
  sut: AuthMiddleware
  validationSpy: Validation
  findUserByTokenSpy: FindUserByToken
}

const makeSut = (): SutTypes => {
  const findUserByTokenSpy = new FindUserByTokenSpy()
  const validationSpy = new ValidationSpy()
  const sut = new AuthMiddleware(validationSpy, findUserByTokenSpy, 'admin')
  return {
    sut,
    validationSpy,
    findUserByTokenSpy
  }
}

class ValidationSpy implements Validation {
  validate (input: any): Error {
    return null
  }
}

class FindUserByTokenSpy implements FindUserByToken {
  async findByToken (token: string, role?: string): Promise<UserModel> {
    return mockUserModel()
  }
}

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    authorization: 'any-protocol any-token'
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
    const findSpy = jest.spyOn(findUserByTokenSpy, 'findByToken')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(findSpy).toBeCalledWith('any-token', 'admin')
  })

  it('should return 403 if FindUserByToken returns null', async () => {
    const { sut, findUserByTokenSpy } = makeSut()
    jest.spyOn(findUserByTokenSpy, 'findByToken').mockReturnValueOnce(null)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ userId: 'any-id' }))
  })

  it('should return 500 if any dependency throws', async () => {
    const validation = new ValidationSpy()
    const findUserByToken = new FindUserByTokenSpy()
    const suts = [].concat(
      new AuthMiddleware(
        {
          validate () {
            throw new Error()
          }
        },
        findUserByToken
      ),
      new AuthMiddleware(validation, {
        findByToken () {
          throw new Error()
        }
      })
    )
    for (const sut of suts) {
      const httpRequest = makeFakeRequest()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
    }
  })
})
