import { UserRepository, MongoHelper } from '@/infra/database/mongodb'
import { AddUserModel } from '@/domain/usecases'
import { env } from '@/main/config'
const uri = env.MONGO_URL

const makeSut = (): UserRepository => {
  const sut = new UserRepository()
  return sut
}

const makeFakeUser = (): AddUserModel => {
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
    const model = makeFakeUser()
    const user = await sut.add(model)
    expect(user.name).toEqual(model.name)
    expect(user.email).toEqual(model.email)
    expect(user.password).toEqual(model.password)
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

  it('should return user when user is found', async () => {
    const sut = makeSut()
    const model = makeFakeUser()
    await sut.add(model)
    const user = await sut.findByEmail(model.email)
    expect(user.name).toEqual(model.name)
    expect(user.email).toEqual(model.email)
    expect(user.password).toEqual(model.password)
  })
})
