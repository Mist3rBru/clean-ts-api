import { MongoHelper } from '@/infra/database/mongodb'
import { setupApp } from '@/main/config'
import { Collection } from 'mongodb'
import { Express } from 'express'
import request from 'supertest'
let usersCollection: Collection
let app: Express

describe('Auth Routes', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
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
          name: 'valid-name',
          email: 'valid-email@example.com',
          password: 'valid-password',
          passwordConfirmation: 'valid-password'
        })
        .expect(200)
    })
  })

  describe('POST /api/login', () => {
    it('should return 200 on login success', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'valid-email@example.com',
          password: 'valid-password'
        })
        .expect(200)
    })

    it('should return 401 on login fail', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'invalid-email@example.com',
          password: 'valid-password'
        })
        .expect(401)

      await request(app)
        .post('/api/login')
        .send({
          email: 'valid-email@example.com',
          password: 'invalid-password'
        })
        .expect(401)
    })
  })
})
