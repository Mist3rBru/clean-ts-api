import { DbAddSurvey } from '@/data/usecases'
import { AddSurveyRepository } from '@/data/protocols'
import { mockSurveyModel } from '@/tests/domain/mocks'
import { mockAddSurveyRepository } from '@/tests/data/mocks'

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositorySpy: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = mockAddSurveyRepository()
  const sut = new DbAddSurvey(addSurveyRepositorySpy)
  return {
    sut,
    addSurveyRepositorySpy
  }
}

describe('DbAddSurvey', () => {
  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    const addSpy = jest.spyOn(addSurveyRepositorySpy, 'add')
    const model = mockSurveyModel()
    await sut.add(model)
    expect(addSpy).toBeCalledWith(model)
  })

  it('should throw if any dependency throws', async () => {
    const sut = new DbAddSurvey({
      add () {
        throw new Error()
      }
    })
    const model = mockSurveyModel()
    const promise = sut.add(model)
    await expect(promise).rejects.toThrow()
  })
})
