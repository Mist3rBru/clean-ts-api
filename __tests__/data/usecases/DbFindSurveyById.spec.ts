import { DbFindSurveyById } from '@/data/usecases'
import { FindSurveyByIdRepository } from '@/data/protocols'
import { mockSurveyModel } from '@/tests/domain/mocks'
import { mockFindSurveyByIdRepository } from '@/tests/data/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbFindSurveyById
  findSurveyByIdRepositorySpy: FindSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const findSurveyByIdRepositorySpy = mockFindSurveyByIdRepository()
  const sut = new DbFindSurveyById(
    findSurveyByIdRepositorySpy
  )
  return {
    sut,
    findSurveyByIdRepositorySpy
  }
}

describe('DbFindSurveyById', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  it('should call FindSurveyByIdRepository with correct values', async () => {
    const { sut, findSurveyByIdRepositorySpy } = makeSut()
    const findByIdSpy = jest.spyOn(findSurveyByIdRepositorySpy, 'findById')
    await sut.findById('any-id')
    expect(findByIdSpy).toBeCalledWith('any-id')
  })

  it('should return a survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.findById('any-id')
    expect(survey).toEqual(mockSurveyModel())
  })

  it('should throw if any dependendency throws', async () => {
    const sut = new DbFindSurveyById(
      { findById () { throw new Error() } }
    )
    const promise = sut.findById('any-id')
    await expect(promise).rejects.toThrow()
  })
})
