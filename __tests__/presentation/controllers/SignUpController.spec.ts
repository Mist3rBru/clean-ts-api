import { SignUpController } from '@/presentation/controllers'
import { badRequest, forbidden, ok } from '@/presentation/helpers'
import { MissingParamError, EmailInUseError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { Validation } from '@/validation/protocols'
import { AddUser, Authentication } from '@/domain/usecases'
import {
  mockValidation,
  mockAddUser,
  mockAuthentication,
} from '@/tests/presentation/mocks'
type SutTypes = {
  sut: SignUpController
  validationSpy: Validation
  addUserSpy: AddUser
  authenticationSpy: Authentication
}

const makeSut = (): SutTypes => {
  const validationSpy = mockValidation()
  const addUserSpy = mockAddUser()
  const authenticationSpy = mockAuthentication()
  const sut = new SignUpController(validationSpy, addUserSpy, authenticationSpy)
  return {
    sut,
    addUserSpy,
    validationSpy,
    authenticationSpy,
  }
}

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any-name',
    email: 'any-email',
    password: 'any-password',
    passwordConfirmation: 'any-password',
  },
})

describe('Signup Controller', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const validateSpy = jest.spyOn(validationSpy, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    const fakeError = new MissingParamError('any-param')
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(fakeError)
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(fakeError))
  })

  it('should call AddAccount with correct values', async () => {
    const { sut, addUserSpy } = makeSut()
    const addSpy = jest.spyOn(addUserSpy, 'add')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    const { passwordConfirmation, ...expectedValues } = httpRequest.body
    expect(addSpy).toBeCalledWith(expectedValues)
  })

  it('should call authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const authSpy = jest.spyOn(authenticationSpy, 'auth')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    const { email, password } = httpRequest.body
    expect(authSpy).toBeCalledWith({ email, password })
  })

  it('should should return 403 if AddAccount returns null', async () => {
    const { sut, addUserSpy } = makeSut()
    jest.spyOn(addUserSpy, 'add').mockReturnValueOnce(null)
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  it('should return 500 if any dependency throws', async () => {
    const addUserSpy = mockAddUser()
    const validationSpy = mockValidation()
    const authenticationSpy = mockAuthentication()
    const suts = [].concat(
      new SignUpController(
        {
          validate() {
            throw new Error()
          },
        },
        addUserSpy,
        authenticationSpy
      ),
      new SignUpController(
        validationSpy,
        {
          add() {
            throw new Error()
          },
        },
        authenticationSpy
      ),
      new SignUpController(validationSpy, addUserSpy, {
        auth() {
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

  it('should return 200 if user be signed up', async () => {
    const { sut } = makeSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ token: 'any-token' }))
  })
})
