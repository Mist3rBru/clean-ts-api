import { DbAddSurveyResult } from '@/data/usecases'
import { FindSurveyResultByIdRepository, AddSurveyResultRepository } from '@/data/protocols'
import { mockAddSurveyResultParams } from '@/tests/domain/mocks'
import { mockFindSurveyResultByIdRepository, mockAddSurveyResultRepository } from '@/tests/data/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbAddSurveyResult
  addSurveyResultRepositorySpy: AddSurveyResultRepository
  findSurveyResultByIdRepositorySpy: FindSurveyResultByIdRepository
}

const makeSut = (): SutTypes => {
  const findSurveyResultByIdRepositorySpy = mockFindSurveyResultByIdRepository()
  const addSurveyResultRepositorySpy = mockAddSurveyResultRepository()
  const sut = new DbAddSurveyResult(addSurveyResultRepositorySpy, findSurveyResultByIdRepositorySpy)
  return {
    sut,
    addSurveyResultRepositorySpy,
    findSurveyResultByIdRepositorySpy
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
    const { sut, addSurveyResultRepositorySpy } = makeSut()
    const listSpy = jest.spyOn(addSurveyResultRepositorySpy, 'add')
    const model = mockAddSurveyResultParams()
    await sut.add(model)
    expect(listSpy).toBeCalledWith(model)
  })

  it('should return survey on success', async () => {
    const { sut } = makeSut()
    const model = mockAddSurveyResultParams()
    const survey = await sut.add(model)
    expect(survey.surveyId).toEqual(model.surveyId)
    expect(survey.answers[0].answer).toEqual(model.answer)
  })

  it('should throw if any dependency throws', async () => {
    const findSurveyResultByIdRepository = mockFindSurveyResultByIdRepository()
    const addSurveyResultRepository = mockAddSurveyResultRepository()
    const suts = [].concat(
      new DbAddSurveyResult(
        { add () { throw new Error() } },
        findSurveyResultByIdRepository
      ),
      new DbAddSurveyResult(
        addSurveyResultRepository,
        { findById () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const promise = sut.add(mockAddSurveyResultParams())
      await expect(promise).rejects.toThrow()
    }
  })
})
