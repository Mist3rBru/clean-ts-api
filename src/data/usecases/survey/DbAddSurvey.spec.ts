import { DbAddSurvey } from '@/data/usecases'
import { AddSurveyRepository } from '@/data/protocols'
import { AddSurveyModel } from '@/domain/usecases'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositorySpy: AddSurveyRepository
}
const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy()
  const sut = new DbAddSurvey(addSurveyRepositorySpy)
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
    answers: [
      {
        answer: 'any-answer',
        image: 'any-image'
      }
    ],
    date: new Date()
  }
}

describe('DbAddSurvey', () => {
  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositorySpy, 'add')
    const model = makeSurveyModel()
    await sut.add(model)
    expect(addSpy).toBeCalledWith(model)
  })

  it('should throw if any dependency throws', async () => {
    const sut = new DbAddSurvey({
      add () {
        throw new Error()
      }
    })
    const model = makeSurveyModel()
    const promise = sut.add(model)
    await expect(promise).rejects.toThrow()
  })
})
