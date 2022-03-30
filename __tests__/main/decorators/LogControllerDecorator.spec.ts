import { LogControllerDecorator } from '@/main/decorators'
import { Controller, HttpResponse } from '@/presentation/protocols'
import { serverError } from '@/presentation/helpers'
import { LogErrorRepository } from '@/data/protocols'
import faker from '@faker-js/faker'

type SutTypes = {
  sut: LogControllerDecorator
  controllerSpy: ControllerSpy
  logErrorRepositorySpy: LogErrorRepositorySpy
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
  request: any
  httpResponse: HttpResponse = {
    statusCode: 200,
    body: {
      test: faker.lorem.sentence()
    }
  }

  async handle (request: any): Promise<HttpResponse> {
    this.request = request
    return this.httpResponse
  }
}

class LogErrorRepositorySpy implements LogErrorRepository {
  stack: string
  async log (stack: string): Promise<void> {
    this.stack = stack
  }
}

const makeRequest = (): any => ({
  test: faker.lorem.sentence()
})

describe('LogControllerDecorator', () => {
  it('should call Controller with correct value', async () => {
    const { sut, controllerSpy } = makeSut()
    const request = makeRequest()
    await sut.handle(request)
    expect(controllerSpy.request).toEqual(request)
  })

  it('should return Controller response', async () => {
    const { sut, controllerSpy } = makeSut()
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(controllerSpy.httpResponse)
  })

  it('should call LogErrorRepository with correct stack error if Controller returns a server error', async () => {
    const { sut, controllerSpy, logErrorRepositorySpy } = makeSut()
    controllerSpy.httpResponse = serverError(new Error('any-error'))
    await sut.handle(makeRequest())
    expect(logErrorRepositorySpy.stack).toBe(controllerSpy.httpResponse.body.stack)
  })
})
