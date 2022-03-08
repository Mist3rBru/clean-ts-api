import { LoginController } from './LoginController'
import { badRequest } from '@/presentation/helpers'
import { MissingParamError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { EmailValidator } from '@/validation/protocols'

interface SutTypes {
  sut: LoginController
  emailValidatorSpy: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new LoginController(
    emailValidatorSpy
  )
  return {
    sut,
    emailValidatorSpy
  }
}

class EmailValidatorSpy implements EmailValidator {
  isValid (email: string): boolean {
    return true
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
})
