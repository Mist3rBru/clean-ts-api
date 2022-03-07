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
    return new Promise(resolve => resolve({
      statusCode: 200,
      body: {
        ...request.body
      }
    }))
  }
}

describe('LogControllerDecorator', () => {
  it('should call Controller with correct value', async () => {
    const { sut, controllerSpy } = makeSut()
    const handleSpy = jest.spyOn(controllerSpy, 'handle')
    const request = {
      body: {
        name: 'any-name'
      }
    }
    await sut.handle(request)
    expect(handleSpy).toBeCalledWith(request)
  })
})
