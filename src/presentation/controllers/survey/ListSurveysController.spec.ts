import { ListSurveysController } from '@/presentation/controllers'
import { ListSurveys } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'
import MockDate from 'mockdate'

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

describe('ListSurveysController', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  it('should call ListSurveys', async () => {
    const { sut, listSurveysSpy } = makeSut()
    const listSpy = jest.spyOn(listSurveysSpy, 'list')
    await sut.handle({})
    expect(listSpy).toBeCalled()
  })
})
