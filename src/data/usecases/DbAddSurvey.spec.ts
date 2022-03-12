import { DbAddSurvey } from '@/data/usecases'
import { AddSurveyRepository } from '@/data/protocols'
import { AddSurveyModel } from '@/domain/usecases'

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositorySpy: AddSurveyRepository
}
const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy()
  const sut = new DbAddSurvey(
    addSurveyRepositorySpy
  )
  return {
    sut,
    addSurveyRepositorySpy
  }
}

class AddSurveyRepositorySpy implements AddSurveyRepository {
  async add (survey: AddSurveyModel): Promise<void> {}
}

const makeSurveyModel = (): AddSurveyModel => {
  return {
    question: 'any-question',
    answers: [{
      answer: 'any-answer',
      image: 'any-image'
    }]
  }
}

describe('DbAddSurvey', () => {
  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositorySpy, 'add')
    const surveyModel = makeSurveyModel()
    await sut.add(surveyModel)
    expect(addSpy).toBeCalledWith(surveyModel)
  })
})
