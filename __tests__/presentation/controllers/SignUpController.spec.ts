import { SignUpController } from '@/presentation/controllers'
import { badRequest, forbidden, ok } from '@/presentation/helpers'
import { MissingParamError, EmailInUseError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { ValidationSpy, AddUserSpy, AuthenticationSpy } from '@/tests/presentation/mocks'
import faker from '@faker-js/faker'

type SutTypes = {
  sut: SignUpController
  validationSpy: ValidationSpy
  addUserSpy: AddUserSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addUserSpy = new AddUserSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new SignUpController(validationSpy, addUserSpy, authenticationSpy)
  return {
    sut,
    addUserSpy,
    validationSpy,
    authenticationSpy
  }
}

const mockRequest = (): HttpRequest => {
  const fakePassword = faker.internet.password()
  return {
    body: {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: fakePassword,
      passwordConfirmation: fakePassword
    }
  }
}

describe('Signup Controller', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validationSpy.input).toEqual(httpRequest.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    const fakeError = new MissingParamError('any-param')
    validationSpy.error = fakeError
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(fakeError))
  })

  it('should call AddAccount with correct values', async () => {
    const { sut, addUserSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    const { passwordConfirmation, ...expectedValues } = httpRequest.body
    expect(addUserSpy.model).toEqual(expectedValues)
  })

  it('should call authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    const { email, password } = httpRequest.body
    expect(authenticationSpy.credentials).toEqual({ email, password })
  })

  it('should should return 403 if AddAccount returns null', async () => {
    const { sut, addUserSpy } = makeSut()
    addUserSpy.user = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  it('should return 500 if any dependency throws', async () => {
    const addUserSpy = new AddUserSpy()
    const validationSpy = new ValidationSpy()
    const authenticationSpy = new AuthenticationSpy()
    const suts = [].concat(
      new SignUpController(
        { validate () { throw new Error() } },
        addUserSpy,
        authenticationSpy
      ),
      new SignUpController(
        validationSpy,
        { add () { throw new Error() } },
        authenticationSpy
      ),
      new SignUpController(
        validationSpy,
        addUserSpy,
        { auth () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const httpResponse = await sut.handle(mockRequest())
      expect(httpResponse.statusCode).toBe(500)
    }
  })

  it('should return 200 if user be signed up', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(authenticationSpy.authModel))
  })
})
