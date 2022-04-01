import { MongoHelper } from '@/infra/database/mongodb'
import { setupApp } from '@/main/config/app'
import { env } from '@/main/config'
import { Collection } from 'mongodb'
import { Express } from 'express'
import { sign } from 'jsonwebtoken'
import request from 'supertest'
import faker from '@faker-js/faker'
import { MissingParamError } from '@/presentation/errors'
import { SurveyModel } from '@/domain/models'
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

describe('GraphQL Survey', () => {
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

  describe('Surveys Query', () => {
    const query = `query {
      surveys {
        id
        question
        answers {
          image
          answer
        }
        date
      }
    }`

    it('should return Surveys', async () => {
      const survey = await mockSurvey()
      const accessToken = await mockAccessToken()
      const res = await request(app)
        .post('/graphql')
        .set('authorization', accessToken)
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.surveys.length).toBe(1)
      expect(res.body.data.surveys[0].id).toBeTruthy()
      expect(res.body.data.surveys[0].question).toBe(survey.question)
      expect(res.body.data.surveys[0].date).toBe(survey.date.toISOString())
      expect(res.body.data.surveys[0].answers).toEqual([{
        image: survey.answers[0].image,
        answer: survey.answers[0].answer
      }, {
        image: null,
        answer: survey.answers[1].answer
      }])
    })

    it('should return AccessDeniedError if no token is provided', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe(new MissingParamError('token').message)
    })
  })
})
