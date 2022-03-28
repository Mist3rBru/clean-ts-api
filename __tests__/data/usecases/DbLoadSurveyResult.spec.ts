import { FindSurveyByIdRepository, LoadSurveyResultRepository } from '@/data/protocols'
import { DbLoadSurveyResult } from '@/data/usecases'
import { mockFindSurveyByIdRepository, mockLoadSurveyResultRepository } from '@/tests/data/mocks'
import { mockEmptySurveyResultModel, mockSurveyResultModel } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepository
  findSurveyByIdRepositorySpy: FindSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const findSurveyByIdRepositorySpy = mockFindSurveyByIdRepository()
  const loadSurveyResultRepositorySpy = mockLoadSurveyResultRepository()
  const sut = new DbLoadSurveyResult(
    loadSurveyResultRepositorySpy,
    findSurveyByIdRepositorySpy
  )
  return {
    sut,
    loadSurveyResultRepositorySpy,
    findSurveyByIdRepositorySpy
  }
}

describe('DbLoadSurveyResult', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  it('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultRepositorySpy, 'load')
    await sut.load('any-survey-id', 'any-user-id')
    expect(loadSpy).toBeCalledWith('any-survey-id', 'any-user-id')
  })

  it('should call FindSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, findSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'load').mockReturnValueOnce(null)
    const loadSpy = jest.spyOn(findSurveyByIdRepositorySpy, 'findById')
    await sut.load('any-survey-id', 'any-user-id')
    expect(loadSpy).toBeCalledWith('any-survey-id')
  })

  it('should return all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    jest.spyOn(loadSurveyResultRepositorySpy, 'load').mockReturnValueOnce(null)
    const surveyResult = await sut.load('any-survey-id', 'any-user-id')
    expect(surveyResult).toEqual(mockEmptySurveyResultModel())
  })

  it('should throw if any dependency throws', async () => {
    const findSurveyByIdRepository = mockFindSurveyByIdRepository()
    const suts = [].concat(
      new DbLoadSurveyResult(
        { load () { throw new Error() } },
        findSurveyByIdRepository
      ),
      new DbLoadSurveyResult(
        { load () { return null } },
        { findById () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const promise = sut.load('any-survey-id', 'any-user-id')
      await expect(promise).rejects.toThrow()
    }
  })

  it('should return SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.load('any-survey-id', 'any-user-id')
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
