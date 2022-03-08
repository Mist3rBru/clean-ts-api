import { LoginController } from '@/presentation/controllers'
import { badRequest, ok, unauthorized } from '@/presentation/helpers'
import { MissingParamError, InvalidParamError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { EmailValidator, Validation } from '@/validation/protocols'
import { Authentication, token } from '@/domain/usecases'

interface SutTypes {
  sut: LoginController
  emailValidatorSpy: EmailValidator
  authenticationSpy: Authentication
  validationSpy: Validation
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new LoginController(
    emailValidatorSpy,
    authenticationSpy,
    validationSpy
  )
  return {
    sut,
    emailValidatorSpy,
    authenticationSpy,
    validationSpy
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
    const fakeError = new MissingParamError('any-param')
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(fakeError)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.body.error).toBe(fakeError.message)
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
        new AuthenticationSpy(),
        new ValidationSpy()
      ),
      new LoginController(
        new EmailValidatorSpy(),
        { auth () { throw new Error() } },
        new ValidationSpy()
      ),
      new LoginController(
        new EmailValidatorSpy(),
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
