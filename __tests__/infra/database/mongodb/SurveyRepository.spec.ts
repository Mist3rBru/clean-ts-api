import { MongoHelper, SurveyRepository } from '@/infra/database/mongodb'
import { mockAddSurveyParams, mockSurveyList } from '@/tests/domain/mocks'
import { Collection } from 'mongodb'
const uri = process.env.MONGO_URL
let surveyCollection: Collection

const makeSut = (): SurveyRepository => {
  return new SurveyRepository()
}

describe('SurveyRepository', () => {
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

  describe('Add()', () => {
    it('should register a survey on MongoDB', async () => {
      const sut = makeSut()
      const model = mockAddSurveyParams()
      await sut.add(model)
      const survey = await surveyCollection.findOne({
        question: model.question
      })
      expect(survey.question).toBe(model.question)
      expect(survey.answers).toEqual(model.answers)
    })
  })

  describe('list()', () => {
    it('should list surveys from survey collection', async () => {
      const surveysList = mockSurveyList()
      await surveyCollection.insertMany(surveysList)
      const sut = makeSut()
      const list = await sut.list()
      expect(list.length).toBe(2)
      expect(list[0].question).toBe(surveysList[0].question)
      expect(list[1].question).toBe(surveysList[1].question)
    })
  })

  describe('findById()', () => {
    it('should return a existent survey', async () => {
      const { insertedId } = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const survey = await sut.findById(insertedId.toString())
      expect(survey).toBeTruthy()
    })
  })
})
