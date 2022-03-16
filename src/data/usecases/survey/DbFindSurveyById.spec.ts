import { DbFindSurveyById } from './DbFindSurveyById'
import { FindSurveyByIdRepository } from '@/data/protocols'
import { SurveyModel } from '@/domain/models'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbFindSurveyById
  findSurveyByIdRepositorySpy: FindSurveyByIdRepository
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

class FindSurveyByIdRepositorySpy implements FindSurveyByIdRepository {
  async findById (id: string): Promise<SurveyModel> {
    return makeFakeSurvey()
  }
}

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any-id',
  question: 'any-question',
  answers: [{
    image: 'any-image',
    answer: 'any-answer'
  }],
  date: new Date()
})

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
    expect(survey).toEqual(makeFakeSurvey())
  })

  it('should throw if any depende', async () => {
    const suts = [].concat(
      new DbFindSurveyById(
        { findById () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const promise = sut.findById()
      await expect(promise).rejects.toThrow()
    }
  })
})
