import { SignUpController } from '@/presentation/controllers'
import { badRequest, forbidden, ok } from '@/presentation/helpers'
import { MissingParamError, EmailInUseError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { Validation } from '@/validation/protocols'
import {
  AddUser,
  AddUserModel,
  Authentication,
  AuthenticationModel
} from '@/domain/usecases'
import { UserModel } from '@/domain/models'

type SutTypes = {
  sut: SignUpController
  validationSpy: Validation
  addUserSpy: AddUser
  authenticationSpy: Authentication
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

class AddUserSpy implements AddUser {
  async add (model: AddUserModel): Promise<UserModel> {
    const user = {
      id: 'any-id',
      name: model.name,
      email: model.email,
      password: 'hashed-password'
    }
    return user
  }
}

class ValidationSpy implements Validation {
  validate (input: any): Error {
    return null
  }
}

class AuthenticationSpy implements Authentication {
  async auth (credentials: AuthenticationModel): Promise<string> {
    return 'any-token'
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any-name',
    email: 'any-email',
    password: 'any-password',
    passwordConfirmation: 'any-password'
  }
})

describe('Signup Controller', () => {
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
    expect(httpResponse).toEqual(badRequest(fakeError))
  })

  it('should call AddAccount with correct values', async () => {
    const { sut, addUserSpy } = makeSut()
    const addSpy = jest.spyOn(addUserSpy, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    const { passwordConfirmation, ...expectedValues } = httpRequest.body
    expect(addSpy).toBeCalledWith(expectedValues)
  })

  it('should call authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const authSpy = jest.spyOn(authenticationSpy, 'auth')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    const { email, password } = httpRequest.body
    expect(authSpy).toBeCalledWith({ email, password })
  })

  it('should should return 403 if AddAccount returns null', async () => {
    const { sut, addUserSpy } = makeSut()
    jest.spyOn(addUserSpy, 'add').mockReturnValueOnce(null)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  it('should return 500 if any dependency throws', async () => {
    const addUserSpy = new AddUserSpy()
    const validationSpy = new ValidationSpy()
    const authenticationSpy = new AuthenticationSpy()
    const suts = [].concat(
      new SignUpController(
        {
          validate () {
            throw new Error()
          }
        },
        addUserSpy,
        authenticationSpy
      ),
      new SignUpController(
        validationSpy,
        {
          add () {
            throw new Error()
          }
        },
        authenticationSpy
      ),
      new SignUpController(validationSpy, addUserSpy, {
        auth () {
          throw new Error()
        }
      })
    )
    for (const sut of suts) {
      const httpRequest = makeFakeRequest()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
    }
  })

  it('should return 200 if user be signed up', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({ token: 'any-token' }))
  })
})
