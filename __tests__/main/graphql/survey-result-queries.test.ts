import { MongoHelper } from '@/infra/database/mongodb'
import { setupApp } from '@/main/config/app'
import { env } from '@/main/config'
import { Collection } from 'mongodb'
import { Express } from 'express'
import { sign } from 'jsonwebtoken'
import request from 'supertest'
import faker from '@faker-js/faker'
import { SurveyModel } from '@/domain/models'
import { MissingParamError } from '@/presentation/errors'

let surveyCollection: Collection
let usersCollection: Collection
let app: Express

const mockAccessToken = async (): Promise<string> => {
  const res = await usersCollection.insertOne({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    role: 'admin'
  })
  const id = res.insertedId.toHexString()
  const token = sign({ id }, env.TOKEN_SECRET)
  const accessToken = 'Bearer ' + token
  return accessToken
}

const mockSurvey = async (): Promise<SurveyModel> => {
  const surveyData = {
    question: faker.lorem.sentence(),
    answers: [{
      image: faker.image.imageUrl(),
      answer: faker.lorem.word()
    }, {
      answer: faker.lorem.word()
    }],
    date: faker.date.recent()
  }
  const { insertedId } = await surveyCollection.insertOne(surveyData)
  return Object.assign({}, surveyData, { id: insertedId.toString() })
}

const mockSurveyResultQuery = (survey: SurveyModel): String => `query {
  surveyResult (surveyId: "${survey.id}") {
    question
    answers {
      answer
      count
      percent
      isCurrentUserAnswer
    }
    date
  }
}`

const mockAddSurveyResultMutation = (survey: SurveyModel): String => `mutation {
  addSurveyResult (surveyId: "${survey.id}", answer: "${survey.answers[0].answer}") {
    question
    answers {
      answer
      count
      percent
      isCurrentUserAnswer
    }
    date
  }
}`

describe('GraphQL SurveyResult', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
    surveyCollection = await MongoHelper.getCollection('survey')
    usersCollection = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await surveyCollection.deleteMany({})
    await usersCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('SurveyResult Query', () => {
    it('should return SurveyResult', async () => {
      const accessToken = await mockAccessToken()
      const survey = await mockSurvey()
      const query = mockSurveyResultQuery(survey)
      const res = await request(app)
        .post('/graphql')
        .set('authorization', accessToken)
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.surveyResult.question).toBe(survey.question)
      expect(res.body.data.surveyResult.date).toBe(survey.date.toISOString())
      expect(res.body.data.surveyResult.answers).toEqual([{
        answer: survey.answers[0].answer,
        count: 0,
        percent: 0,
        isCurrentUserAnswer: false
      }, {
        answer: survey.answers[1].answer,
        count: 0,
        percent: 0,
        isCurrentUserAnswer: false
      }])
    })

    it('should return AccessDeniedError if no token is provided', async () => {
      const survey = await mockSurvey()
      const query = mockSurveyResultQuery(survey)
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe(new MissingParamError('token').message)
    })
  })

  describe('AddSurveyResult Mutation', () => {
    it('should return SurveyResult', async () => {
      const accessToken = await mockAccessToken()
      const survey = await mockSurvey()
      const query = mockAddSurveyResultMutation(survey)
      const res = await request(app)
        .post('/graphql')
        .set('authorization', accessToken)
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.addSurveyResult.question).toBe(survey.question)
      expect(res.body.data.addSurveyResult.date).toBe(survey.date.toISOString())
      expect(res.body.data.addSurveyResult.answers).toEqual([{
        answer: survey.answers[0].answer,
        count: 1,
        percent: 100,
        isCurrentUserAnswer: true
      }, {
        answer: survey.answers[1].answer,
        count: 0,
        percent: 0,
        isCurrentUserAnswer: false
      }])
    })

    it('should return AccessDeniedError if no token is provided', async () => {
      const survey = await mockSurvey()
      const query = mockAddSurveyResultMutation(survey)
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe(new MissingParamError('token').message)
    })
  })
})
