import { mockAddUserParams, mockAddSurveyParams } from '@/tests/domain/mocks'
import { MongoHelper } from '@/infra/database/mongodb'
import { app, env } from '@/main/config'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
let surveyCollection: Collection
let usersCollection: Collection
let accessToken: string
let surveyId: string

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.MONGO_URL)
    surveyCollection = await MongoHelper.getCollection('survey')
    usersCollection = await MongoHelper.getCollection('users')

    await usersCollection.deleteMany({})
    await surveyCollection.deleteMany({})

    const surveyResult = await surveyCollection.insertOne(mockAddSurveyParams())
    surveyId = surveyResult.insertedId.toString()

    const userResult = await usersCollection.insertOne(mockAddUserParams())
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
        .send({ answer: 'any-answer' })
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
        .send({ answer: 'any-answer' })
        .expect(400)
    })
  })
})
