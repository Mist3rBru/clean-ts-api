import { MissingParamError } from '../../utils/errors'
import { Signup } from './signup'

const makeSut = (): any => {
  const sut = new Signup()
  return sut
}

describe('Signup Controller', () => {
  it('should return 400 if no name is provided', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        email: 'any-email',
        password: 'any-password',
        password_confirmation: 'any-password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('name').message)
  })

  it('should return 400 if no email is provided', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'any-name',
        password: 'any-password',
        password_confirmation: 'any-password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('email').message)
  })

  it('should return 400 if no password is provided', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email',
        password_confirmation: 'any-password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('password').message)
  })

  it('should return 400 if no password_confirmation is provided', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        name: 'any-name',
        email: 'any-email',
        password: 'any-password',
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('password_confirmation').message)
  })
})
