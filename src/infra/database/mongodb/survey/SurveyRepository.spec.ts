import { AddSurveyModel } from '@/domain/usecases'
import { MongoHelper, SurveyRepository } from '@/infra/database/mongodb'
import { env } from '@/main/config'
import { Collection } from 'mongodb'
const uri = env.MONGO_URL
let surveyCollection: Collection

const makeSut = (): SurveyRepository => {
  const sut = new SurveyRepository()
  return sut
}

const makeFakeSurveys = (): AddSurveyModel[] => {
  return [
    {
      question: 'question01',
      answers: [{
        image: 'image01',
        answer: 'answer01'
      }],
      date: new Date()
    },
    {
      question: 'question02',
      answers: [{
        image: 'image02',
        answer: 'answer02'
      }],
      date: new Date()
    }
  ]
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
      const model = makeFakeSurveys()[0]
      await sut.add(model)
      const survey = await surveyCollection.findOne({ question: model.question })
      expect(survey.question).toBe(model.question)
      expect(survey.answers).toEqual(model.answers)
    })
  })

  describe('list()', () => {
    it('should list surveys from survey collection', async () => {
      const surveysList = makeFakeSurveys()
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
      const surveysList = makeFakeSurveys()
      const { insertedId } = await surveyCollection.insertOne(surveysList[0])
      const sut = makeSut()
      const survey = await sut.findById(insertedId.toString())
      expect(survey).toBeTruthy()
    })
  })
})
