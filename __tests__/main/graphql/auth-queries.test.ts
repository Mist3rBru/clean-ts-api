import { EmailInUseError } from '@/presentation/errors'
import { MongoHelper } from '@/infra/database/mongodb'
import { setupApp } from '@/main/config/app'
import { Express } from 'express'
import request from 'supertest'
import faker from '@faker-js/faker'

const name = faker.name.findName()
const email = faker.internet.email()
const password = faker.internet.password()
const passwordConfirmation = password

let app: Express

const makeLoginQuery = (email: string, password: string): String => `query {
    login (email: "${email}", password: "${password}") {
      accessToken
      userName
    }
  }`

describe('GraphQL Authentication', () => {
  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL)
    const usersCollection = await MongoHelper.getCollection('users')
    await usersCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('SignUp Mutation', () => {
    const query = `mutation {
      signUp (name: "${name}", email: "${email}", password: "${password}", passwordConfirmation: "${passwordConfirmation}") {
        accessToken
        userName
      }
    }`

    it('should return an user if valid parameters are provided', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.signUp.accessToken).toBeTruthy()
      expect(res.body.data.signUp.userName).toBe(name)
    })

    it('should return EmailInUseError if email provided is already in use', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(403)
      expect(res.body.data).toBeFalsy()
      expect(res.body.errors[0].message).toBe(new EmailInUseError().message)
    })
  })

  describe('Login Query', () => {
    it('should return an user if valid credentials are provided', async () => {
      const query = makeLoginQuery(email, password)
      const res = await request(app)
        .post('/graphql')
        .send({ query })
      expect(res.status).toBe(200)
      expect(res.body.data.login.accessToken).toBeTruthy()
      expect(res.body.data.login.userName).toBe(name)
    })

    it('should return UnauthorizedError on invalid credentials', async () => {
      let query = makeLoginQuery('invalid@mail.com', password)
      await request(app)
        .post('/graphql')
        .send({ query })
        .expect(401)

      query = makeLoginQuery(email, 'invalid-password')
      await request(app)
        .post('/graphql')
        .send({ query })
        .expect(401)
    })
  })
})
