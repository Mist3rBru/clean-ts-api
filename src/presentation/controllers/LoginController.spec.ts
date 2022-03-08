import { LoginController } from '@/presentation/controllers'
import { badRequest, ok, unauthorized } from '@/presentation/helpers'
import { MissingParamError, InvalidParamError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { EmailValidator } from '@/validation/protocols'
import { Authentication, token } from '@/domain/usecases'

interface SutTypes {
  sut: LoginController
  emailValidatorSpy: EmailValidator
  authenticationSpy: Authentication
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new LoginController(
    emailValidatorSpy,
    authenticationSpy
  )
  return {
    sut,
    emailValidatorSpy,
    authenticationSpy
  }
}

class EmailValidatorSpy implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

class AuthenticationSpy implements Authentication {
  async auth (email: string, password: string): Promise<token> {
    return 'any-token'
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: { 
    email: 'any-email',
    password: 'any-password'
  }
})

describe('LoginController', () => {
  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const request = {
      body: {
        password: 'any-password'
      }
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorSpy, 'isValid')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith(httpRequest.body.email)
  })

  it('should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    jest.spyOn(emailValidatorSpy, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any-email'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const authSpy = jest.spyOn(authenticationSpy, 'auth')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    const { email, password } = httpRequest.body
    expect(authSpy).toHaveBeenCalledWith(email, password)
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
        { isValid () { throw new Error() } },
        new AuthenticationSpy()
      ),
      new LoginController(
        new EmailValidatorSpy(),
        { auth () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const httpRequest = makeFakeRequest()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
    }
  })
})
