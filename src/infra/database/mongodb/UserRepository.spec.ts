import { UserRepository } from './UserRepository'
import { MongoHelper } from './MongoHelper'
import { AddUserModel } from '@/domain/usecases'
import { env } from '@/main/config'
const uri = env.MONGO_URL

const makeSut = (): UserRepository => {
  const sut = new UserRepository()
  return sut
}

const makeUser = (): AddUserModel => {
  return {
    name: 'any-name',
    email: 'any-email',
    password: 'any-password'
  }
}

describe('UserRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(uri)
  })

  beforeEach(async () => {
    const usersCollection = await MongoHelper.getCollection('users')
    await usersCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should return user when registered on MongoDB', async () => {
    const sut = makeSut()
    const model = makeUser()
    const user = await sut.add(model)
    expect(user.name).toBe(model.name)
    expect(user.email).toBe(model.email)
  })
})
