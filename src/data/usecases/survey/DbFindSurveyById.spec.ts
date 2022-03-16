import { DbFindSurveyById } from './DbFindSurveyById'
import { FindSurveyByIdRepository } from '@/data/protocols'
import { SurveyModel } from '@/domain/models'

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
    return {
      id: 'any-id',
      question: 'any-question',
      answers: [{
        image: 'any-image',
        answer: 'any-answer'
      }],
      date: new Date()
    }
  }
}

describe('DbFindSurveyById', () => {
  it('should call FindSurveyByIdRepository with correct values', async () => {
    const { sut, findSurveyByIdRepositorySpy } = makeSut()
    const findByIdSpy = jest.spyOn(findSurveyByIdRepositorySpy, 'findById')
    await sut.findById('any-id')
    expect(findByIdSpy).toBeCalledWith('any-id')
  })
})
