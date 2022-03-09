import { SignUpController } from '@/presentation/controllers'
import { MissingParamError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { ok } from '@/presentation/helpers'
import { Validation } from '@/validation/protocols'
import { AddUser, AddUserModel } from '@/domain/usecases'
import { UserModel } from '@/domain/models'

interface SutTypes {
  sut: SignUpController
  addUserSpy: AddUser
  validationSpy: Validation
}

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addUserSpy = new AddUserSpy()
  const sut = new SignUpController(
    addUserSpy,
    validationSpy
  )
  return {
    sut,
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
    expect(httpResponse.body.error).toBe(fakeError.message)
  })

  it('should call AddAccount with correct values', async () => {
    const { sut, addUserSpy } = makeSut()
    const addSpy = jest.spyOn(addUserSpy, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    const { passwordConfirmation, ...expectedValues } = httpRequest.body
    expect(addSpy).toBeCalledWith(expectedValues)
  })
  
  it('should return 500 if any dependency throws', async () => {
    const suts = [].concat(
      new SignUpController(
        { add: () => { throw new Error() } },
        new ValidationSpy()
      ),
      new SignUpController(
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
