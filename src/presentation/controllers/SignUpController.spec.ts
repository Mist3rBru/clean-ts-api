import { SignUpController } from '@/presentation/controllers'
import { MissingParamError, InvalidParamError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { ok, badRequest } from '@/presentation/helpers'
import { EmailValidator, Validation } from '@/validation/protocols'
import { AddUser, AddUserModel } from '@/domain/usecases'
import { UserModel } from '@/domain/models'

interface SutTypes {
  sut: SignUpController
  emailValidatorSpy: EmailValidator
  addUserSpy: AddUser
  validationSpy: Validation
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addUserSpy = new AddUserSpy()
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new SignUpController(
    emailValidatorSpy,
    addUserSpy,
    validationSpy
  )
  return {
    sut,
    emailValidatorSpy,
    addUserSpy,
    validationSpy
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

class EmailValidatorSpy implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

class ValidationSpy implements Validation {
  validate (input: any): Error {
    return null
  }
}

const makeFakeRequest = (): HttpRequest => ({ 
  body: {
    name: 'any-name',
    email: 'any-email',
    password: 'any-password',
    password_confirmation: 'any-password'
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
    const error = new MissingParamError('any-param')
    jest.spyOn(validationSpy, 'validate').mockReturnValueOnce(error)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.body.error).toBe(error.message)
  })

  it('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {}
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: { name: 'any-name' }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('should return 400 if no password_confirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email',
        password: 'any-password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password_confirmation')))
  })

  it('should call EmailValidator with correct values', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorSpy, 'isValid')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith(httpRequest.body.email)
  })

  it('should return 400 if email provided is not valid', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    jest.spyOn(emailValidatorSpy, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email',
        password: 'any-password',
        password_confirmation: 'invalid-password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('password confirmation')))
  })

  it('should call AddAccount with correct values', async () => {
    const { sut, addUserSpy } = makeSut()
    const addSpy = jest.spyOn(addUserSpy, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    const { password_confirmation: passwordConfirmation, ...expectedValues } = httpRequest.body
    expect(addSpy).toBeCalledWith(expectedValues)
  })
  
  it('should return 500 if any dependency throws', async () => {
    const suts = [].concat(
      new SignUpController(
        { isValid: () => { throw new Error() } },
        new AddUserSpy(),
        new ValidationSpy()
      ),
      new SignUpController(
        new EmailValidatorSpy(),
        { add: () => { throw new Error() } },
        new ValidationSpy()
      ),
      new SignUpController(
        new EmailValidatorSpy(),
        new AddUserSpy(),
        { validate: () => { throw new Error() } }
      )
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
    expect(httpResponse).toEqual(ok({
      id: 'any-id',
      name: 'any-name',
      email: 'any-email',
      password: 'hashed-password'
    }))
  })
})
