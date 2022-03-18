import { DbSaveSurveyResult } from '@/data/usecases'
import { SaveSurveyResultRepository } from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/usecases'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositorySpy: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositorySpy)
  return {
    sut,
    saveSurveyResultRepositorySpy
  }
}

class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  async save (survey: SaveSurveyResultParams): Promise<SurveyResultModel> {
    return mockSurveyResultModel()
  }
}

describe('DbSaveSurveyResult', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  it('should call SaveSurveyResultRepository with correct value', async () => {
    const { sut, saveSurveyResultRepositorySpy } = makeSut()
    const listSpy = jest.spyOn(saveSurveyResultRepositorySpy, 'save')
    const model = mockSaveSurveyResultParams()
    await sut.save(model)
    expect(listSpy).toBeCalledWith(model)
  })

  it('should return survey on success', async () => {
    const { sut } = makeSut()
    const model = mockSaveSurveyResultParams()
    const survey = await sut.save(model)
    expect(survey.answer).toEqual(model.answer)
    expect(survey.surveyId).toEqual(model.surveyId)
    expect(survey.userId).toEqual(model.userId)
  })

  it('should throw if any dependency throws', async () => {
    const sut = new DbSaveSurveyResult({
      save () { throw new Error() }
    })
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })
})
