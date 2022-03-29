import { DbListSurveys } from '@/data/usecases'
import { ListSurveysRepositorySpy } from '@/tests/data/mocks'
import MockDate from 'mockdate'
import { throwError } from '../../domain/mocks'

type SutTypes = {
  sut: DbListSurveys
  listSurveysRepositorySpy: ListSurveysRepositorySpy
}

const makeSut = (): SutTypes => {
  const listSurveysRepositorySpy = new ListSurveysRepositorySpy()
  const sut = new DbListSurveys(
    listSurveysRepositorySpy
  )
  return {
    sut,
    listSurveysRepositorySpy
  }
}

describe('DbListSurveys', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  it('should call ListSurveysRepository', async () => {
    const { sut, listSurveysRepositorySpy } = makeSut()
    await sut.list()
    expect(listSurveysRepositorySpy.count).toBe(1)
  })

  it('should return list from ListSurveysRepository', async () => {
    const { sut, listSurveysRepositorySpy } = makeSut()
    const list = await sut.list()
    expect(list).toEqual(listSurveysRepositorySpy.surveyList)
  })

  it('should throw if ListSurveysRepository throws', async () => {
    const { sut, listSurveysRepositorySpy } = makeSut()
    jest.spyOn(listSurveysRepositorySpy, 'list').mockImplementationOnce(throwError)
    const promise = sut.list()
    await expect(promise).rejects.toThrow()
  })
})
