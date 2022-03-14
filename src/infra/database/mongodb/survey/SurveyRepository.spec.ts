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

const makeFakeSurveys = (): SurveyModel[] => {
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
