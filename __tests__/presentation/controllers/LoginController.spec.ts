import { LoginController } from '@/presentation/controllers'
import { badRequest, ok, unauthorized } from '@/presentation/helpers'
import { AuthenticationSpy, ValidationSpy } from '@/tests/presentation/mocks'
import faker from '@faker-js/faker'

type SutTypes = {
  sut: LoginController
  authenticationSpy: AuthenticationSpy
  validationSpy: ValidationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new LoginController(authenticationSpy, validationSpy)
  return {
    sut,
    authenticationSpy,
    validationSpy
  }
}

const mockRequest = (): LoginController.Request => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

describe('LoginController', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    const fakeError = new Error('any-param')
    validationSpy.error = fakeError
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(fakeError))
  })

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(authenticationSpy.data).toEqual(request)
  })

  it('should  return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    authenticationSpy.authModel = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  it('should  return 200 if valid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(authenticationSpy.authModel))
  })

  it('should  return 500 if any dependency throws', async () => {
    const authenticationSpy = new AuthenticationSpy()
    const validationSpy = new ValidationSpy()
    const suts = [].concat(
      new LoginController(
        { auth () { throw new Error() } },
        validationSpy
      ),
      new LoginController(
        authenticationSpy,
        { validate () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const httpResponse = await sut.handle(mockRequest())
      expect(httpResponse.statusCode).toBe(500)
    }
  })
})
