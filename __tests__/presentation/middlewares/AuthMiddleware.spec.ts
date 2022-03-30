import { AuthMiddleware } from '@/presentation/middlewares'
import { badRequest, forbidden, ok } from '@/presentation/helpers'
import { AccessDeniedError } from '@/presentation/errors'
import { ValidationSpy, FindUserByTokenSpy } from '@/tests/presentation/mocks'
import faker from '@faker-js/faker'

type SutTypes = {
  sut: AuthMiddleware
  validationSpy: ValidationSpy
  findUserByTokenSpy: FindUserByTokenSpy
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

let token: string
let protocol: string
const mockRequest = (): AuthMiddleware.Request => {
  protocol = faker.internet.protocol()
  token = faker.datatype.uuid()
  return {
    authorization: protocol + ' ' + token
  }
}

describe('AuthMiddleware', () => {
  it('should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  it('should return 400 if invalid token is provided', async () => {
    const { sut, validationSpy } = makeSut()
    const fakeError = new Error('any-error')
    validationSpy.error = fakeError
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(fakeError))
  })

  it('should call FindUserByToken with correct value', async () => {
    const { sut, findUserByTokenSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(findUserByTokenSpy.data.token).toBe(token)
  })

  it('should return 403 if FindUserByToken returns null', async () => {
    const { sut, findUserByTokenSpy } = makeSut()
    findUserByTokenSpy.user = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should return 200 on success', async () => {
    const { sut, findUserByTokenSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ userId: findUserByTokenSpy.user.id }))
  })

  it('should return 500 if any dependency throws', async () => {
    const validationSpy = new ValidationSpy()
    const findUserByTokenSpy = new FindUserByTokenSpy()
    const suts = [].concat(
      new AuthMiddleware(
        { validate () { throw new Error() } },
        findUserByTokenSpy
      ),
      new AuthMiddleware(
        validationSpy,
        { findByToken () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const httpResponse = await sut.handle(mockRequest())
      expect(httpResponse.statusCode).toBe(500)
    }
  })
})
