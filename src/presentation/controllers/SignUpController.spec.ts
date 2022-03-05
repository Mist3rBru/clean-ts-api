import { MissingParamError, InvalidParamError } from '@/utils/errors'
import { EmailValidator } from '@/validation/protocols'
import { SignUpController } from '@/presentation/controllers/SignUpController'
import { AddUser, AddUserModel } from '@/domain/usecases'
import { UserModel } from '@/domain/models'

interface SutTypes {
  sut: SignUpController
  emailValidatorSpy: EmailValidator
  addUserSpy: AddUser
}

const makeSut = (): SutTypes => {
  const addUserSpy = new AddUserSpy()
  const emailValidatorSpy = new EmailValidatorSpy()
  const sut = new SignUpController(
    emailValidatorSpy,
    addUserSpy
  )
  return {
    sut,
    emailValidatorSpy,
    addUserSpy
  }
}

class AddUserSpy implements AddUser {
  async add (model: AddUserModel): Promise<UserModel> {
    const user = {
      id: 'any-id',
      name: model.name,
      email: model.email,
      password_hash: 'any-hash'
    }
    return user
  }
}

class EmailValidatorSpy implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

describe('Signup Controller', () => {
  it('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {}
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('name').message)
  })

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: { name: 'any-name' }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('email').message)
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
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('password').message)
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
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('password_confirmation').message)
  })

  it('should call EmailValidator with correct values', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorSpy, 'isValid')
    const httpRequest = { 
      body: {
        name: 'any-name',
        email: 'any-email',
        password: 'any-password',
        password_confirmation: 'any-password'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toBeCalledWith('any-email')
  })

  it('should return 400 if email provided is not valid', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    jest.spyOn(emailValidatorSpy, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'invalid-email',
        password: 'any-password',
        password_confirmation: 'any-password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new InvalidParamError('email').message)
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
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new InvalidParamError('password confirmation').message)
  })

  it('should call AddAccount with correct values', async () => {
    const { sut, addUserSpy } = makeSut()
    const addSpy = jest.spyOn(addUserSpy, 'add')
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email',
        password: 'any-password',
        password_confirmation: 'any-password'
      }
    }
    await sut.handle(httpRequest)
    const { password_confirmation: passwordConfirmation, ...expectedValues } = httpRequest.body
    expect(addSpy).toBeCalledWith(expectedValues)
  })
  
  it('should return 500 if any dependency throws', async () => {
    const suts = [].concat(
      new SignUpController(
        { isValid: () => { throw new Error() } },
        { add: () => { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const httpRequest = {
        body: {
          name: 'any-name',
          email: 'any-email',
          password: 'any-password',
          password_confirmation: 'any-password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(500)
    }
  })

  it('should return 200 if user be signed up', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'valid-name',
        email: 'valid-email',
        password: 'valid-password',
        password_confirmation: 'valid-password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'any-id',
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password_hash: 'any-hash'
    })
  })
})
