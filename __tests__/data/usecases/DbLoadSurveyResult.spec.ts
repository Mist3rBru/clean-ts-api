import { LoadSurveyResultRepository } from '@/data/protocols'
import { DbLoadSurveyResult } from '@/data/usecases'
import { mockLoadSurveyResultRepository } from '@/tests/data/mocks'
import { mockSurveyResultModel } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = mockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositorySpy
  )
  return {
    sut,
    loadSurveyResultRepositorySpy
  }
}

describe('DbLoadSurveyResult', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  it('should call FindSurveyResultByIdRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultRepositorySpy, 'load')
    await sut.load('any-survey-id', 'any-user-id')
    expect(loadSpy).toBeCalledWith('any-survey-id', 'any-user-id')
  })

  it('should throw if any dependency throws', async () => {
    const suts = [].concat(
      new DbLoadSurveyResult(
        { load () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const promise = sut.load('any-survey-id', 'any-user-id')
      await expect(promise).rejects.toThrow()
    }
  })

  it('should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.load('any-survey-id', 'any-user-id')
    expect(survey).toEqual(mockSurveyResultModel())
  })
})
