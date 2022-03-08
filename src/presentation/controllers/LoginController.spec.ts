import { LoginController } from './LoginController'
import { badRequest } from '@/presentation/helpers'
import { MissingParamError } from '@/presentation/errors'

const makeSut = (): LoginController => {
  const sut = new LoginController()
  return sut
}

describe('LoginController', () => {
  it('should return 400 if no email is provided', async () => {
    const sut = makeSut()
    const request = {
      body: {
        password: 'any-password'
      }
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
