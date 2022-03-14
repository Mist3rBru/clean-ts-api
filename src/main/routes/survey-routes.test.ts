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
    await surveyCollection.deleteMany({})
    await usersCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /api/survey', () => {
    it('should return 204 on register success', async () => {
      const { insertedId } = await usersCollection.insertOne({
        name: 'any-name',
        email: 'any-email',
        password: 'any-password',
        role: 'admin'
      })

      const token = sign({ id: insertedId }, env.TOKEN_SECRET)
      await request(app)
        .post('/api/survey')
        .set('authorization', 'Bearer ' + token)
        .send({
          question: 'any-question',
          answers: [{
            image: 'any-image',
            answer: 'any-answer'
          }, {
            answer: 'any-answer-again'
          }]
        })
        .expect(204)
      const dbSurvey = await surveyCollection.findOne({ question: 'any-question' })
      expect(dbSurvey).toBeTruthy()
    })

    it('should return 403 if user has not a valid role', async () => {
      const { insertedId } = await usersCollection.insertOne({
        name: 'any-name',
        email: 'any-email',
        password: 'any-password',
        role: 'invalid-role'
      })

      const token = sign({ id: insertedId }, env.TOKEN_SECRET)
      await request(app)
        .post('/api/survey')
        .set('authorization', 'Bearer ' + token)
        .send({
          question: 'any-question',
          answers: [{
            image: 'any-image',
            answer: 'any-answer'
          }]
        })
        .expect(403)
    })
  })
})
