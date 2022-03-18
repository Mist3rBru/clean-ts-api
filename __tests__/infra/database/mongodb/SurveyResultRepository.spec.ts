import { SaveSurveyResultParams } from '@/domain/usecases'
import { SurveyResultRepository, MongoHelper } from '@/infra/database/mongodb'
import { env } from '@/main/config'
import { Collection } from 'mongodb'
const uri = env.MONGO_URL
let surveyCollection: Collection

const makeSut = (): SurveyResultRepository => {
  const sut = new SurveyResultRepository()
  return sut
}

const makeFakeSurveys = (): SaveSurveyResultParams[] => {
  return [
    {
      surveyId: 'survey01',
      userId: 'user01',
      answer: 'answer01',
      date: new Date()
    },
    {
      surveyId: 'survey01',
      userId: 'user01',
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

  describe('save()', () => {
    it('should create and return survey result', async () => {
      const model = makeFakeSurveys()[0]
      const sut = makeSut()
      const survey = await sut.save(model)
      expect(survey).toBeTruthy()
    })

    it('should update and return updated survey', async () => {
      const modelList = makeFakeSurveys()
      const sut = makeSut()
      const res = await sut.save(modelList[0])
      const survey = await sut.save(modelList[1])
      expect(res.id).toEqual(survey.id)
      expect(survey.userId).toBe(modelList[0].userId)
      expect(survey.surveyId).toBe(modelList[0].surveyId)
      expect(survey.answer).toBe(modelList[1].answer)
    })
  })
})
