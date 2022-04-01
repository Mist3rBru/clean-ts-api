import { SurveyModel } from '@/domain/models'
import { SurveyResultRepository, MongoHelper } from '@/infra/database/mongodb'
import { mockAddSurveyParams, mockAddSurveyResultParams, mockAddUserParams } from '@/tests/domain/mocks'
import { Collection, ObjectId } from 'mongodb'
const uri = process.env.MONGO_URL
let surveyResultCollection: Collection
let surveyCollection: Collection
let usersCollection: Collection

const makeSut = (): SurveyResultRepository => {
  return new SurveyResultRepository()
}

const mockSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams())
  const survey = await surveyCollection.findOne({ _id: res.insertedId })
  return MongoHelper.map(survey)
}

const mockUserId = async (): Promise<string> => {
  const res = await usersCollection.insertOne(mockAddUserParams())
  return res.insertedId.toHexString()
}

describe('SurveyResultRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(uri)
    surveyResultCollection = await MongoHelper.getCollection('survey_results')
    surveyCollection = await MongoHelper.getCollection('surveys')
    usersCollection = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await surveyResultCollection.deleteMany({})
    await surveyCollection.deleteMany({})
    await usersCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('add()', () => {
    it('should add a survey result if it is new', async () => {
      const sut = makeSut()
      const model = mockAddSurveyResultParams()
      await sut.add(model)
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(model.surveyId),
        userId: new ObjectId(model.userId)
      })
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
    it('should load survey results', async () => {
      const survey = await mockSurvey()
      const userIdOne = await mockUserId()
      const userIdTwo = await mockUserId()
      const query = [
        {
          surveyId: new ObjectId(survey.id),
          userId: new ObjectId(userIdOne),
          answer: survey.answers[0].answer,
          date: new Date()
        }, {
          surveyId: new ObjectId(survey.id),
          userId: new ObjectId(userIdTwo),
          answer: survey.answers[0].answer,
          date: new Date()
        }
      ]
      await surveyResultCollection.insertMany(query)
      const sut = makeSut()
      const surveyResult = await sut.load({ surveyId: survey.id, userId: userIdOne })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.surveyId).toBe(survey.id)
      expect(surveyResult.answers[0].count).toBe(2)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[0].isCurrentUserAnswer).toBe(true)
      expect(surveyResult.answers[1].count).toBe(0)
      expect(surveyResult.answers[1].percent).toBe(0)
      expect(surveyResult.answers[1].isCurrentUserAnswer).toBe(false)
    })
  })
})
