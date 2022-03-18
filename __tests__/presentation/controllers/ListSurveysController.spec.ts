import { mockSurveyList } from '@/tests/domain/mocks'
import { ListSurveysController } from '@/presentation/controllers'
import { ListSurveys } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'
import MockDate from 'mockdate'
import { noContent, ok } from '@/presentation/helpers'

type SutTypes = {
  sut: ListSurveysController
  listSurveysSpy: ListSurveys
}

const makeSut = (): SutTypes => {
  const listSurveysSpy = new ListSurveysSpy()
  const sut = new ListSurveysController(
    listSurveysSpy
  )
  return {
    sut,
    listSurveysSpy
  }
}

class ListSurveysSpy implements ListSurveys {
  async list (): Promise<SurveyModel[]> {
    return mockSurveyList()
  }
}

describe('ListSurveysController', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  it('should call ListSurveys', async () => {
    const { sut, listSurveysSpy } = makeSut()
    const listSpy = jest.spyOn(listSurveysSpy, 'list')
    await sut.handle({})
    expect(listSpy).toBeCalled()
  })

  it('should return 200 and surveys list on if ListSurveys returns a list', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(mockSurveyList()))
  })

  it('should return 204 if ListSurveys returns no list', async () => {
    const { sut, listSurveysSpy } = makeSut()
    jest.spyOn(listSurveysSpy, 'list').mockReturnValueOnce(
      new Promise(resolve => resolve([]))
    )
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  it('should return 500 if any dependency throws', async () => {
    const suts = [].concat(
      new ListSurveysController(
        { list () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const res = await sut.handle()
      expect(res.statusCode).toBe(500)
    }
  })
})
