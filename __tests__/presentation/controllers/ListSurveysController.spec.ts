import { ListSurveysController } from '@/presentation/controllers'
import { noContent, ok } from '@/presentation/helpers'
import { ListSurveysSpy } from '@/tests/presentation/mocks'
import MockDate from 'mockdate'
import { throwError } from '../../domain/mocks'

type SutTypes = {
  sut: ListSurveysController
  listSurveysSpy: ListSurveysSpy
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

describe('ListSurveysController', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  it('should call ListSurveys', async () => {
    const { sut, listSurveysSpy } = makeSut()
    await sut.handle({})
    expect(listSurveysSpy.count).toBe(1)
  })

  it('should return 200 and surveys list on if ListSurveys returns a list', async () => {
    const { sut, listSurveysSpy } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(listSurveysSpy.surveyList))
  })

  it('should return 204 if ListSurveys returns no list', async () => {
    const { sut, listSurveysSpy } = makeSut()
    listSurveysSpy.surveyList = []
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  it('should return 500 if ListSurveys throws', async () => {
    const { sut, listSurveysSpy } = makeSut()
    jest.spyOn(listSurveysSpy, 'list').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({})
    expect(httpResponse.statusCode).toBe(500)
  })
})
