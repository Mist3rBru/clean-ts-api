import { SurveyResultRepository } from './SurveyResultRepository'
import { SaveSurveyResultModel } from '@/domain/usecases'
import { MongoHelper } from '@/infra/database/mongodb'
import { env } from '@/main/config'
import { Collection } from 'mongodb'
const uri = env.MONGO_URL
let surveyCollection: Collection

const makeSut = (): SurveyResultRepository => {
  const sut = new SurveyResultRepository()
  return sut
}

const makeFakeSurveys = (): SaveSurveyResultModel[] => {
  return [
    {
      surveyId: 'survey01',
      userId: 'user01',
      answer: 'answer01',
      date: new Date()
    },
    {
      surveyId: 'survey02',
      userId: 'user02',
      answer: 'answer02',
      date: new Date()
    }
  ]
}

describe('SurveyResultRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(uri)
    surveyCollection = await MongoHelper.getCollection('survey')
  })

  beforeEach(async () => {
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should create and return a survey result', async () => {
    const model = makeFakeSurveys()[0]
    const sut = makeSut()
    const survey = await sut.save(model)
    expect(survey).toBeTruthy()
  })
})
