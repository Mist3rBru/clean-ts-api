import { SurveyModel } from '@/domain/models'
import { MongoHelper, SurveyRepository } from '@/infra/database/mongodb'
import { env } from '@/main/config'
import { Collection } from 'mongodb'
const uri = env.MONGO_URL
let surveyCollection: Collection

const makeSut = (): SurveyRepository => {
  const sut = new SurveyRepository()
  return sut
}

const makeSurveyModel = (): SurveyModel => {
  return {
    question: 'any-question',
    answers: [{
      answer: 'any-answer',
      image: 'any-image'
    }],
    date: new Date()
  }
}

describe('SurveyRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(uri)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should register a survey on MongoDB', async () => {
    const sut = makeSut()
    const model = makeSurveyModel()
    await sut.add(model)
    const survey = await surveyCollection.findOne({ question: model.question })
    expect(survey.question).toBe(model.question)
    expect(survey.answers).toEqual(model.answers)
  })
})
