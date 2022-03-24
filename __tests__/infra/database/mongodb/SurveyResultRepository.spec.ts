import { env } from '@/main/config'
import { SurveyResultRepository, MongoHelper } from '@/infra/database/mongodb'
import { mockAddSurveyResultParams, mockSurveyModel, mockUserModel } from '@/tests/domain/mocks'
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
      const surveyResult = await surveyResultCollection.findOne({ surveyId: model.surveyId, userId: model.userId })
      expect(surveyResult).toBeTruthy()
    })

    it('should update and return updated survey', async () => {
      const model = mockAddSurveyResultParams()
      model.answer = 'other-answer'
      const updatedModel = model
      await surveyResultCollection.insertOne(model)
      const sut = makeSut()
      await sut.add(updatedModel)
      const surveyResult = await surveyResultCollection.find({ surveyId: model.surveyId }).toArray()
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.length).toBe(1)
      expect(surveyResult[0].answer).toBe(updatedModel.answer)
    })
  })

  describe('load()', () => {
    it('should load survey result', async () => {
      const survey = mockSurveyModel()
      const user = mockUserModel()
      const query = [
        {
          surveyId: survey.id,
          userId: user.id,
          answer: survey.answers[0].answer,
          date: new Date()
        }, {
          surveyId: survey.id,
          userId: user.id,
          answer: survey.answers[0].answer,
          date: new Date()
        }, {
          surveyId: survey.id,
          userId: user.id,
          answer: survey.answers[1].answer,
          date: new Date()
        }, {
          surveyId: survey.id,
          userId: user.id,
          answer: survey.answers[1].answer,
          date: new Date()
        }
      ]
      await surveyResultCollection.insertMany(query)
      const sut = makeSut()
      const surveyResult = await sut.load(survey.id, user.id)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toBe(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(50)
      expect(surveyResult.answers[1].count).toBe(2)
      expect(surveyResult.answers[1].percent).toBe(50)
      expect(surveyResult.answers[2].count).toBe(0)
      expect(surveyResult.answers[2].percent).toBe(0)
    })
  })
})
