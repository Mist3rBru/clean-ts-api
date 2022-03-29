import { DbFindSurveyById } from '@/data/usecases'
import { FindSurveyByIdRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbFindSurveyById
  findSurveyByIdRepositorySpy: FindSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const findSurveyByIdRepositorySpy = new FindSurveyByIdRepositorySpy()
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
    await sut.findById('any-id')
    expect(findSurveyByIdRepositorySpy.id).toBe('any-id')
  })

  it('should return a survey on success', async () => {
    const { sut, findSurveyByIdRepositorySpy } = makeSut()
    const survey = await sut.findById('any-id')
    expect(survey).toEqual(findSurveyByIdRepositorySpy.survey)
  })

  it('should throw if FindSurveyByIdRepository throws', async () => {
    const { sut, findSurveyByIdRepositorySpy } = makeSut()
    jest.spyOn(findSurveyByIdRepositorySpy, 'findById').mockImplementationOnce(throwError)
    const promise = sut.findById('any-id')
    await expect(promise).rejects.toThrow()
  })
})
