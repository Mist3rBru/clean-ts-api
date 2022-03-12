import { LoginController } from '@/presentation/controllers'
import { ok, unauthorized } from '@/presentation/helpers'
import { HttpRequest } from '@/presentation/protocols'
import { Validation } from '@/validation/protocols'
import { Authentication, AuthenticationModel } from '@/domain/usecases'

interface SutTypes {
  sut: LoginController
  authenticationSpy: Authentication
  validationSpy: Validation
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new LoginController(
    authenticationSpy,
    validationSpy
  )
  return {
    sut,
    authenticationSpy,
    validationSpy
  }
}

class AuthenticationSpy implements Authentication {
  async auth (credentials: AuthenticationModel): Promise<string> {
    return 'any-token'
  }
}

class ValidationSpy implements Validation {
  validate (input: any): Error {
    return null
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any-email',
    password: 'any-password'
  }
})

describe('LoginController', () => {
  it('should call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut()
    const validateSpy = jest.spyOn(validationSpy, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    const fakeError = new Error('any-param')
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(fakeError)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.body.message).toBe('any-param')
  })

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const authSpy = jest.spyOn(authenticationSpy, 'auth')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    const credentials = httpRequest.body
    expect(authSpy).toHaveBeenCalledWith(credentials)
  })

  it('should  return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(null)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unauthorized())
  })

  it('should  return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ token: 'any-token' }))
  })

  it('should  return 500 if any dependency throws', async () => {
    const suts = [].concat(
      new LoginController(
        { auth () { throw new Error() } },
        new ValidationSpy()
      ),
      new LoginController(
        new AuthenticationSpy(),
        { validate () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const httpRequest = makeFakeRequest()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
    }
  })
})
