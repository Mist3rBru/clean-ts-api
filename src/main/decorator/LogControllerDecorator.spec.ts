import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from './LogControllerDecorator'
import { LogErrorRepository } from '@/data/protocols'
import { serverError } from '@/presentation/helpers'

interface SutTypes {
  sut: LogControllerDecorator
  controllerSpy: Controller
  logErrorRepositorySpy: LogErrorRepository
}

const makeSut = (): SutTypes => {
  const logErrorRepositorySpy = new LogErrorRepositorySpy()
  const controllerSpy = new ControllerSpy()
  const sut = new LogControllerDecorator(
    controllerSpy,
    logErrorRepositorySpy
  )
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
    return new Promise(resolve => resolve(httpResponse))
  }
}

class LogErrorRepositorySpy implements LogErrorRepository {
  async log (stackError: string): Promise<void> {
    return new Promise(resolve => resolve())
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

  it('should return Controller response', async () => {
    const { sut } = makeSut()
    const request = makeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse.body).toEqual(request.body)
    expect(httpResponse.statusCode).toBe(200)
  })

  it('should call LogErrorRepository with correct stack error if Controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any-stack'
    const error = serverError(fakeError)
    jest.spyOn(controllerSpy, 'handle').mockReturnValueOnce(
      new Promise(resolve => resolve(error))
    )
    const logSpy = jest.spyOn(logErrorRepositorySpy, 'log')
    const request = makeRequest()
    await sut.handle(request)
    expect(logSpy).toBeCalledWith('any-stack')
  })
})
