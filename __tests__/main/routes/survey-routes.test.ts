import { mockAddSurveyParams, mockAddSurveyParamsList, mockAddUserParams } from '@/tests/domain/mocks'
import { MongoHelper } from '@/infra/database/mongodb'
import { app, env } from '@/main/config'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
let surveyCollection: Collection
let usersCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.MONGO_URL)
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

  describe('POST /api/survey', () => {
    it('should return 204 on register success', async () => {
      const { insertedId } = await usersCollection.insertOne(
        mockAddUserParams('admin')
      )
      const adminToken = sign({ id: insertedId }, env.TOKEN_SECRET)
      const surveyModel = mockAddSurveyParams()
      await request(app)
        .post('/api/survey')
        .set('authorization', 'Bearer ' + adminToken)
        .send(surveyModel)
        .expect(204)
      const dbSurvey = await surveyCollection.findOne({
        question: surveyModel.question
      })
      expect(dbSurvey).toBeTruthy()
    })

    it('should return 403 if user has not a valid role', async () => {
      const { insertedId } = await usersCollection.insertOne(
        mockAddUserParams('invalid-role')
      )
      const defaultToken = sign({ id: insertedId }, env.TOKEN_SECRET)
      await request(app)
        .post('/api/survey')
        .set('authorization', 'Bearer ' + defaultToken)
        .send(mockAddSurveyParams())
        .expect(403)
    })
  })

  describe('GET /api/survey', () => {
    it('should return 200 on list success', async () => {
      await surveyCollection.insertMany(mockAddSurveyParamsList())
      const { insertedId } = await usersCollection.insertOne(mockAddUserParams())
      const defaultToken = sign({ id: insertedId }, env.TOKEN_SECRET)
      await request(app)
        .get('/api/survey')
        .set('authorization', 'Bearer ' + defaultToken)
        .send()
        .expect(200)
    })

    it('should return 400 on make request without access token', async () => {
      await surveyCollection.insertMany(mockAddSurveyParamsList())
      await request(app)
        .get('/api/survey')
        .send()
        .expect(400)
    })
  })
})
