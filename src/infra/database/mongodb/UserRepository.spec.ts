import { UserRepository, MongoHelper } from '@/infra/database/mongodb'
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

describe('UserRepository add', () => {
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

describe('UserRepository findByEmail', () => {
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

  it('should return null when user is not found', async () => {
    const sut = makeSut()
    const user = await sut.findByEmail('any-email')
    expect(user).toBeNull()
  })
})
