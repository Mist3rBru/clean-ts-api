import { SurveyModel, SurveyResultModel } from '@/domain/models'
import { FindSurveyById, SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok } from '@/presentation/helpers'
import { HttpRequest } from '@/presentation/protocols'
import { SaveSurveyResultController } from '@/presentation/controllers'
import MockDate from 'mockdate'

type SutTypes = {
  sut: SaveSurveyResultController
  findSurveyByIdSpy: FindSurveyById
  saveSurveyResultSpy: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const saveSurveyResultSpy = new SaveSurveyResultSpy()
  const findSurveyByIdSpy = new FindSurveyByIdSpy()
  const sut = new SaveSurveyResultController(
    findSurveyByIdSpy,
    saveSurveyResultSpy
  )
  return {
    sut,
    findSurveyByIdSpy,
    saveSurveyResultSpy
  }
}

class FindSurveyByIdSpy implements FindSurveyById {
  async findById (id: string): Promise<SurveyModel> {
    return makeFakeSurvey()
  }
}

class SaveSurveyResultSpy implements SaveSurveyResult {
  async save (model: SaveSurveyResultParams): Promise<SurveyResultModel> {
    return makeFakeSurveyResult()
  }
}

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any-survey-id'
  },
  body: {
    answer: 'any-answer'
  },
  userId: 'any-user-id'
})

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any-id',
  question: 'any-question',
  answers: [
    {
      image: 'any-image',
      answer: 'any-answer'
    }
  ],
  date: new Date()
})

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'any-id',
  surveyId: 'any-survey-id',
  userId: 'any-user-id',
  answer: 'any-answer',
  date: new Date()
})

describe('SaveSurveyResultController', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
  })

  afterAll(async () => {
    MockDate.reset()
  })

  it('should call FindSurveyById with correct values', async () => {
    const { sut, findSurveyByIdSpy } = makeSut()
    const findByIdSpy = jest.spyOn(findSurveyByIdSpy, 'findById')
    await sut.handle(makeFakeRequest())
    expect(findByIdSpy).toHaveBeenCalledWith('any-survey-id')
  })

  it('should return 403 if FindSurveyById returns null', async () => {
    const { sut, findSurveyByIdSpy } = makeSut()
    jest.spyOn(findSurveyByIdSpy, 'findById').mockReturnValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('survey id')))
  })

  it('should return 403 if invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      params: { surveyId: 'any-survey-id' },
      body: { answer: 'invalid-answer' }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  it('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultSpy, 'save')
    await sut.handle(makeFakeRequest())
    expect(saveSpy).toHaveBeenCalledWith({
      userId: 'any-user-id',
      surveyId: 'any-survey-id',
      answer: 'any-answer',
      date: new Date()
    })
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeSurveyResult()))
  })

  it('should return 500 if any dependency throws', async () => {
    const findSurveyById = new FindSurveyByIdSpy()
    const saveSurveyResult = new SaveSurveyResultSpy()
    const suts = [].concat(
      new SaveSurveyResultController(
        {
          findById () {
            throw new Error()
          }
        },
        saveSurveyResult
      ),
      new SaveSurveyResultController(findSurveyById, {
        save () {
          throw new Error()
        }
      })
    )
    for (const sut of suts) {
      const httpResponse = await sut.handle(makeFakeRequest())
      expect(httpResponse.statusCode).toBe(500)
    }
  })
})
