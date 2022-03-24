import { env } from '@/main/config'
import { SurveyResultRepository, MongoHelper } from '@/infra/database/mongodb'
import { mockAddSurveyResultParams } from '@/tests/domain/mocks'
import { Collection } from 'mongodb'
import MockDate from 'mockdate'
const uri = env.MONGO_URL
let surveyResultCollection: Collection

const makeSut = (): SurveyResultRepository => {
  const sut = new SurveyResultRepository()
  return sut
}

describe('SurveyResultRepository', () => {
  beforeAll(async () => {
    MockDate.set(new Date())
    await MongoHelper.connect(uri)
    surveyResultCollection = await MongoHelper.getCollection('survey_results')
  })

  beforeEach(async () => {
    await surveyResultCollection.deleteMany({})
  })

  afterAll(async () => {
    MockDate.reset()
    await MongoHelper.disconnect()
  })

  describe('add()', () => {
    it('should add a survey result if it is new', async () => {
      const sut = makeSut()
      const model = mockAddSurveyResultParams()
      await sut.add(model)
      const survey = await surveyResultCollection.findOne({ surveyId: model.surveyId, userId: model.userId })
      expect(survey).toBeTruthy()
    })

    it('should update and return updated survey', async () => {
      const model = mockAddSurveyResultParams()
      model.answer = 'other-answer'
      const updatedModel = model
      await surveyResultCollection.insertOne(model)
      const sut = makeSut()
      await sut.add(updatedModel)
      const survey = await surveyResultCollection.find({ surveyId: model.surveyId }).toArray()
      expect(survey).toBeTruthy()
      expect(survey.length).toBe(1)
    })
  })
})
