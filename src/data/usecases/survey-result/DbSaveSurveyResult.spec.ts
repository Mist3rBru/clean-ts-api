import { DbSaveSurveyResult } from '@/data/usecases'
import { SaveSurveyResultRepository } from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'
import MockDate from 'mockdate'
import { SaveSurveyResultModel } from '@/domain/usecases'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositorySpy: SaveSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositorySpy = new SaveSurveyResultRepositorySpy()
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositorySpy
  )
  return {
    sut,
    saveSurveyResultRepositorySpy
  }
}

class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  async save (survey: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return Object.assign({}, survey, { id: 'any-id' })
  }
}

const makeFakeSurvey = (): SaveSurveyResultModel => ({
  userId: '01',
  surveyId: '02',
  answer: 'any-answer',
  date: new Date()
})

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
    const model = makeFakeSurvey()
    await sut.save(model)
    expect(listSpy).toBeCalledWith(model)
  })

  it('should return survey on success', async () => {
    const { sut } = makeSut()
    const model = makeFakeSurvey()
    const survey = await sut.save(model)
    expect(survey.answer).toEqual(model.answer)
    expect(survey.surveyId).toEqual(model.surveyId)
    expect(survey.userId).toEqual(model.userId)
  })

  it('should throw if any dependency throws', async () => {
    const suts = [].concat(
      new DbSaveSurveyResult(
        { save () { throw new Error() } }
      )
    )
    for (const sut of suts) {
      const promise = sut.save()
      await expect(promise).rejects.toThrow()
    }
  })
})
