import { MongoHelper } from '@/infra/database/mongodb'
import { app, env } from '@/main/config'
import { Collection } from 'mongodb'
import request from 'supertest'
let usersCollection: Collection

describe('Auth Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.MONGO_URL)
    usersCollection = await MongoHelper.getCollection('users')
    await usersCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /api/signUp', () => {
    it('should return 200 on signup success', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any-name',
          email: 'any-email@example.com',
          password: 'any-password',
          passwordConfirmation: 'any-password'
        })
        .expect(200)
    })
  })
  
  describe('POST /api/login', () => {
    it('should return 200 on login success', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'any-email@example.com',
          password: 'any-password'
        })
        .expect(200)
    })
  })
})
