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
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(isValidSpy).toBeCalledWith(request.body.email)
  })

  it('should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    jest.spyOn(emailValidatorSpy, 'isValid').mockReturnValueOnce(false)
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const request = {
      body: {
        email: 'any-email'
      }
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const authSpy = jest.spyOn(authenticationSpy, 'auth')
    const request = makeFakeRequest()
    await sut.handle(request)
    const { email, password } = request.body
    expect(authSpy).toHaveBeenCalledWith(email, password)
  })

  it('should  return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(null)
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(unauthorized())
  })

  it('should  return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok({ token: 'any-token' }))
  })
})
