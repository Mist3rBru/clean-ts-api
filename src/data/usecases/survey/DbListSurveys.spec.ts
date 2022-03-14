import { ListSurveysRepository } from '@/data/protocols'
import { DbListSurveys } from '@/data/usecases'
import { SurveyModel } from '@/domain/models'

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
    return makeFakeSurveys()
  }
}

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      question: 'question01',
      answers: [{
        image: 'image01',
        answer: 'answer01'
      }],
      date: new Date()
    },
    {
      question: 'question02',
      answers: [{
        image: 'image02',
        answer: 'answer02'
      }],
      date: new Date()
    }
  ]
}

describe('DbListSurveys', () => {
  it('should call ListSurveysRepository', async () => {
    const { sut, listSurveysRepositorySpy } = makeSut()
    const listSpy = jest.spyOn(listSurveysRepositorySpy, 'list')
    await sut.list()
    expect(listSpy).toBeCalled()
  })
})
