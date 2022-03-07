import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from './LogControllerDecorator'

interface SutTypes {
  sut: LogControllerDecorator
  controllerSpy: Controller
}

const makeSut = (): SutTypes => {
  const controllerSpy = new ControllerSpy()
  const sut = new LogControllerDecorator(controllerSpy)
  return {
    sut,
    controllerSpy
  }
}

class ControllerSpy implements Controller {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = {
      statusCode: 200,
      body: request.body
    }
    return new Promise(resolve => resolve(httpResponse))
  }
}

const makeRequest = (): HttpRequest => ({
  body: {
    name: 'any-name'
  }
})

describe('LogControllerDecorator', () => {
  it('should call Controller with correct value', async () => {
    const { sut, controllerSpy } = makeSut()
    const handleSpy = jest.spyOn(controllerSpy, 'handle')
    const request = makeRequest()
    await sut.handle(request)
    expect(handleSpy).toBeCalledWith(request)
  })

  it('should return Controller response', async () => {
    const { sut } = makeSut()
    const request = makeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse.body).toEqual(request.body)
    expect(httpResponse.statusCode).toBe(200)
  })
})
