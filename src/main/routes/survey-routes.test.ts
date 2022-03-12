import { MongoHelper } from '@/infra/database/mongodb'
import { app, env } from '@/main/config'
import { Collection } from 'mongodb'
import request from 'supertest'
let surveyCollection: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.MONGO_URL)
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /api/survey', () => {
    it('should return 204 on register success', async () => {
      await request(app)
        .post('/api/survey')
        .send({
          question: 'any-question',
          answers: [{ 
            image: 'any-image', 
            answer: 'any-answer' 
          }]
        })
        .expect(204)
    })
  })
})
