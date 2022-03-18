import { AddSurveyModel, AddUserModel } from '@/domain/usecases'
import { MongoHelper } from '@/infra/database/mongodb'
import { app, env } from '@/main/config'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import request from 'supertest'
let surveyCollection: Collection
let usersCollection: Collection
let accessToken: string
let surveyId: string

const makeFakeUser = (role: string = null): AddUserModel => ({
  name: 'any-name',
  email: 'any-email',
  password: 'any-password',
  role: role
})

const makeFakeSurvey = (): AddSurveyModel => ({
  date: new Date(),
  question: 'any-question',
  answers: [{
    image: 'any-image',
    answer: 'any-answer'
  }]
})

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.MONGO_URL)
    surveyCollection = await MongoHelper.getCollection('survey')
    usersCollection = await MongoHelper.getCollection('users')

    await usersCollection.deleteMany({})
    await surveyCollection.deleteMany({})

    const surveyResult = await surveyCollection.insertOne(makeFakeSurvey())
    surveyId = surveyResult.insertedId.toString()

    const userResult = await usersCollection.insertOne(makeFakeUser())
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
