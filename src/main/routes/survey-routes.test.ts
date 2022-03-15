import { SurveyModel } from '@/domain/models'
import { AddUserModel } from '@/domain/usecases'
import { MongoHelper } from '@/infra/database/mongodb'
import { app, env } from '@/main/config'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
let surveyCollection: Collection
let usersCollection: Collection

const makeFakeUser = (role: string = null): AddUserModel => ({
  name: 'any-name',
  email: 'any-email',
  password: 'any-password',
  role: role
})

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      date: new Date(),
      question: 'any-question',
      answers: [{
        image: 'any-image',
        answer: 'any-answer'
      }]
    }, {
      date: new Date(),
      question: 'other-question',
      answers: [{
        image: 'other-image',
        answer: 'other-answer'
      }]
    }
  ]
}

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
      const { insertedId } = await usersCollection.insertOne(makeFakeUser('admin'))
      const adminToken = sign({ id: insertedId }, env.TOKEN_SECRET)
      const res = await request(app)
        .post('/api/survey')
        .set('authorization', 'Bearer ' + adminToken)
        .send(makeFakeSurveys()[0])
      const dbSurvey = await surveyCollection.findOne({ question: 'any-question' })
      console.log(res.body)
      expect(dbSurvey).toBeTruthy()
    })

    it('should return 403 if user has not a valid role', async () => {
      const { insertedId } = await usersCollection.insertOne(makeFakeUser('invalid-role'))
      const defaultToken = sign({ id: insertedId }, env.TOKEN_SECRET)
      await request(app)
        .post('/api/survey')
        .set('authorization', 'Bearer ' + defaultToken)
        .send(makeFakeSurveys()[0])
        .expect(403)
    })
  })
})
