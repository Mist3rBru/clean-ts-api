import { AuthMiddleware } from '@/presentation/middlewares'
import { HttpRequest } from '@/presentation/protocols'
import { badRequest, forbidden, ok } from '@/presentation/helpers'
import { AccessDeniedError, MissingParamError } from '@/presentation/errors'
import { Validation } from '@/validation/protocols'
import { FindUserByToken } from '@/domain/usecases'
import { mockValidation, mockFindUserByToken } from '@/tests/presentation/mocks'

type SutTypes = {
  sut: AuthMiddleware
  validationSpy: Validation
  findUserByTokenSpy: FindUserByToken
}

const makeSut = (): SutTypes => {
  const findUserByTokenSpy = mockFindUserByToken()
  const validationSpy = mockValidation()
  const sut = new AuthMiddleware(validationSpy, findUserByTokenSpy, 'admin')
  return {
    sut,
    validationSpy,
    findUserByTokenSpy,
  }
}

const mockRequest = (): HttpRequest => ({
  headers: {
    authorization: 'any-protocol any-token',
  },
})

describe('AuthMiddleware', () => {
  it('should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()
    const validateSpy = jest.spyOn(validationSpy, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toBeCalledWith(httpRequest.headers)
  })

  it('should return 400 if invalid token is provided', async () => {
    const { sut, validationSpy } = makeSut()
    const fakeError = new MissingParamError('token')
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(fakeError)
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(fakeError))
  })

  it('should call FindUserByToken with correct value', async () => {
    const { sut, findUserByTokenSpy } = makeSut()
    const findSpy = jest.spyOn(findUserByTokenSpy, 'findByToken')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(findSpy).toBeCalledWith('any-token', 'admin')
  })

  it('should return 403 if FindUserByToken returns null', async () => {
    const { sut, findUserByTokenSpy } = makeSut()
    jest.spyOn(findUserByTokenSpy, 'findByToken').mockReturnValueOnce(null)
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ userId: 'any-id' }))
  })

  it('should return 500 if any dependency throws', async () => {
    const validation = mockValidation()
    const findUserByToken = mockFindUserByToken()
    const suts = [].concat(
      new AuthMiddleware(
        {
          validate() {
            throw new Error()
          },
        },
        findUserByToken
      ),
      new AuthMiddleware(validation, {
        findByToken() {
          throw new Error()
        },
      })
    )
    for (const sut of suts) {
      const httpRequest = mockRequest()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
    }
  })
})
