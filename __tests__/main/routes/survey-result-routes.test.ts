import { mockAddUserParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import { MongoHelper } from '@/infra/database/mongodb'
import { setupApp, env } from '@/main/config'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import { Express } from 'express'
import request from 'supertest'
let surveyCollection: Collection
let usersCollection: Collection
let accessToken: string
let surveyId: string
let answer: string
let app: Express

describe('Survey Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
    surveyCollection = await MongoHelper.getCollection('survey')
    usersCollection = await MongoHelper.getCollection('users')

    await usersCollection.deleteMany({})
    await surveyCollection.deleteMany({})

    const surveyModel = mockAddSurveyParams()
    answer = surveyModel.answers[0].answer
    const surveyResult = await surveyCollection.insertOne(surveyModel)
    surveyId = surveyResult.insertedId.toString()

    const userResult = await usersCollection.insertOne(mockAddUserParams('admin'))
    accessToken = sign({ id: userResult.insertedId }, env.TOKEN_SECRET)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('PUT /api/survey/:surveyId/results', () => {
    it('should return 200 on update success', async () => {
      await request(app)
        .put(`/api/survey/${surveyId}/results`)
        .set('authorization', 'Bearer ' + accessToken)
        .send({ answer })
        .expect(200)
    })

    it('should return 403 if invalid answer is provided', async () => {
      await request(app)
        .put(`/api/survey/${surveyId}/results`)
        .set('authorization', 'Bearer ' + accessToken)
        .send({ answer: 'invalid-answer' })
        .expect(403)
    })

    it('should return 400 if no accessToken is provided', async () => {
      await request(app)
        .put(`/api/survey/${surveyId}/results`)
        .send({ answer })
        .expect(400)
    })
  })

  describe('GET /api/survey/:surveyId/results', () => {
    it('should return 200 on success', async () => {
      await request(app)
        .get(`/api/survey/${surveyId}/results`)
        .set('authorization', 'Bearer ' + accessToken)
        .send('')
        .expect(200)
    })

    it('should return 403 if invalid surveyId is provided', async () => {
      await request(app)
        .get('/api/survey/e9843ebf8cbdab606ca67d73/results')
        .set('authorization', 'Bearer ' + accessToken)
        .send('')
        .expect(403)
    })

    it('should return 400 if no access token is provided', async () => {
      await request(app)
        .get(`/api/survey/${surveyId}/results`)
        .send('')
        .expect(400)
    })
  })
})
