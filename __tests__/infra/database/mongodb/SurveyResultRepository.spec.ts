import { SurveyResultRepository, MongoHelper } from '@/infra/database/mongodb'
import { env } from '@/main/config'
import { mockSaveSurveyResultParams, mockSaveSurveyResultParamsList } from '@/tests/domain/mocks'
import { Collection } from 'mongodb'
import MockDate from 'mockdate'
const uri = env.MONGO_URL
let surveyCollection: Collection

const makeSut = (): SurveyResultRepository => {
  const sut = new SurveyResultRepository()
  return sut
}

describe('SurveyResultRepository', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(uri)
    surveyCollection = await MongoHelper.getCollection('survey')
  })

  beforeEach(async () => {
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    MockDate.reset()
    await MongoHelper.disconnect()
  })

  describe('save()', () => {
    it('should create and return survey result', async () => {
      const sut = makeSut()
      const survey = await sut.save(mockSaveSurveyResultParams())
      expect(survey).toBeTruthy()
    })

    it('should update and return updated survey', async () => {
      const modelList = mockSaveSurveyResultParamsList()
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
