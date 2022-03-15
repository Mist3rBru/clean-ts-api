import { LogControllerDecorator } from '@/main/decorators'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers'
import { LogErrorRepository } from '@/data/protocols'

type SutTypes = {
  sut: LogControllerDecorator
  controllerSpy: Controller
  logErrorRepositorySpy: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const controllerSpy = new ControllerSpy()
  const sut = new LogControllerDecorator(controllerSpy, logErrorRepositorySpy)
  return {
    sut,
    controllerSpy,
    logErrorRepositorySpy
  }
}

class ControllerSpy implements Controller {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = {
      statusCode: 200,
      body: request.body
    }
    return new Promise((resolve) => resolve(httpResponse))
  }
}

class ControllerSpyWithError implements Controller {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    const fakeError = new Error()
    fakeError.stack = 'any-stack'
    return serverError(fakeError)
  }
}

class LogErrorRepositorySpy implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    return new Promise((resolve) => resolve())
  }
}

const makeRequest = (): HttpRequest => ({
  body: { test: 'any' }
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
    expect(httpResponse).toEqual(ok(request.body))
  })

  it('should return Controller response', async () => {
    const { sut } = makeSut()
    const request = makeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ok(request.body))
  })

  it('should call LogErrorRepository with correct stack error if Controller returns a server error', async () => {
    const logErrorRepositorySpy = new LogErrorRepositorySpy()
    const logSpy = jest.spyOn(logErrorRepositorySpy, 'log')
    const sut = new LogControllerDecorator(
      new ControllerSpyWithError(),
      logErrorRepositorySpy
    )
    const request = makeRequest()
    await sut.handle(request)
    expect(logSpy).toBeCalledWith('any-stack')
  })
})
