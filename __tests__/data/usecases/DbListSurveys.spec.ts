import { ListSurveysRepository } from '@/data/protocols'
import { DbListSurveys } from '@/data/usecases'
import { SurveyModel } from '@/domain/models'
import MockDate from 'mockdate'
import { mockSurveyList } from '@/tests/domain/mocks'

type SutTypes = {
  sut: DbListSurveys
  listSurveysRepositorySpy: ListSurveysRepository
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

class ListSurveysRepositorySpy implements ListSurveysRepository {
  async list (): Promise<SurveyModel[]> {
    return mockSurveyList()
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
    const listSpy = jest.spyOn(listSurveysRepositorySpy, 'list')
    await sut.list()
    expect(listSpy).toBeCalled()
  })

  it('should return list from ListSurveysRepository', async () => {
    const { sut } = makeSut()
    const list = await sut.list()
    expect(list).toEqual(mockSurveyList())
  })

  it('should throw if any dependency throws', async () => {
    const suts = [].concat(
      new DbListSurveys(
        { list () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const promise = sut.list()
      await expect(promise).rejects.toThrow()
    }
  })
})
