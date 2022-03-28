import { FindSurveyById, AddSurveyResult } from '@/domain/usecases'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok } from '@/presentation/helpers'
import { HttpRequest } from '@/presentation/protocols'
import { AddSurveyResultController } from '@/presentation/controllers'
import {
  mockAddSurveyResult,
  mockFindSurveyById,
} from '@/tests/presentation/mocks'
import MockDate from 'mockdate'
import { mockSurveyResultModel } from '@/tests/domain/mocks'

type SutTypes = {
  sut: AddSurveyResultController
  findSurveyByIdSpy: FindSurveyById
  saveSurveyResultSpy: AddSurveyResult
}

const makeSut = (): SutTypes => {
  const saveSurveyResultSpy = mockAddSurveyResult()
  const findSurveyByIdSpy = mockFindSurveyById()
  const sut = new AddSurveyResultController(
    findSurveyByIdSpy,
    saveSurveyResultSpy
  )
  return {
    sut,
    findSurveyByIdSpy,
    saveSurveyResultSpy,
  }
}

const mockRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any-survey-id',
  },
  body: {
    answer: 'any-answer',
  },
  userId: 'any-user-id',
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
    await sut.handle(mockRequest())
    expect(findByIdSpy).toHaveBeenCalledWith('any-survey-id')
  })

  it('should return 403 if FindSurveyById returns null', async () => {
    const { sut, findSurveyByIdSpy } = makeSut()
    jest.spyOn(findSurveyByIdSpy, 'findById').mockReturnValueOnce(null)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('survey id')))
  })

  it('should return 403 if invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      params: { surveyId: 'any-survey-id' },
      body: { answer: 'invalid-answer' },
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  it('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultSpy } = makeSut()
    const addSpy = jest.spyOn(saveSurveyResultSpy, 'add')
    await sut.handle(mockRequest())
    expect(addSpy).toHaveBeenCalledWith({
      userId: 'any-user-id',
      surveyId: 'any-survey-id',
      answer: 'any-answer',
      date: new Date(),
    })
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })

  it('should return 500 if any dependency throws', async () => {
    const findSurveyById = mockFindSurveyById()
    const addSurveyResult = mockAddSurveyResult()
    const suts = [].concat(
      new AddSurveyResultController(
        {
          findById() {
            throw new Error()
          },
        },
        addSurveyResult
      ),
      new AddSurveyResultController(findSurveyById, {
        add() {
          throw new Error()
        },
      })
    )
    for (const sut of suts) {
      const httpResponse = await sut.handle(mockRequest())
      expect(httpResponse.statusCode).toBe(500)
    }
  })
})
