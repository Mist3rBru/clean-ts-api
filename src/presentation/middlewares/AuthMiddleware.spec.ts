import { AuthMiddleware } from '@/presentation/middlewares'
import { forbidden } from '@/presentation/helpers'
import { AccessDeniedError } from '@/presentation/errors'

const makeSut = (): AuthMiddleware => {
  const sut = new AuthMiddleware()
  return sut
}

describe('AuthMiddleware', () => {
  it('should return 403 if no x-access-token exists in headers', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
