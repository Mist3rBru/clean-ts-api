import { Signup } from './signup'

const makeSut = (): any => {
  const sut = new Signup()
  return sut
}

describe('Signup Controller', () => {
  it('should return 400 if no name is provided', async () => {
    const sut = makeSut()
    const httpResponse = await sut.handle()
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new Error('Missing param: name').message)
  })
})
