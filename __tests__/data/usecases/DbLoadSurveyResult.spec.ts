import { DbLoadSurveyResult } from '@/data/usecases'
import { FindSurveyByIdRepositorySpy, LoadSurveyResultRepositorySpy } from '@/tests/data/mocks'
import { mockEmptySurveyResultModel } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositorySpy: LoadSurveyResultRepositorySpy
  findSurveyByIdRepositorySpy: FindSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositorySpy = new LoadSurveyResultRepositorySpy()
  const findSurveyByIdRepositorySpy = new FindSurveyByIdRepositorySpy()
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
    await sut.load('any-survey-id', 'any-user-id')
    expect(loadSurveyResultRepositorySpy.surveyId).toBe('any-survey-id')
    expect(loadSurveyResultRepositorySpy.userId).toBe('any-user-id')
  })

  it('should call FindSurveyByIdRepository with correct values if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy, findSurveyByIdRepositorySpy } = makeSut()
    loadSurveyResultRepositorySpy.surveyResult = null
    await sut.load('any-survey-id', 'any-user-id')
    expect(findSurveyByIdRepositorySpy.id).toBe('any-survey-id')
  })

  it('should return all answers with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const emptySurveyResult = mockEmptySurveyResultModel()
    loadSurveyResultRepositorySpy.surveyResult = emptySurveyResult
    const surveyResult = await sut.load('any-survey-id', 'any-user-id')
    expect(surveyResult).toEqual(emptySurveyResult)
  })

  it('should throw if any dependency throws', async () => {
    const findSurveyByIdRepositorySpy = new FindSurveyByIdRepositorySpy()
    const suts = [].concat(
      new DbLoadSurveyResult(
        { load () { throw new Error() } },
        findSurveyByIdRepositorySpy
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
    const { sut, loadSurveyResultRepositorySpy } = makeSut()
    const surveyResult = await sut.load('any-survey-id', 'any-user-id')
    expect(surveyResult).toEqual(loadSurveyResultRepositorySpy.surveyResult)
  })
})
