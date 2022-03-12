import { UserRepository, MongoHelper } from '@/infra/database/mongodb'
import { AddUserModel } from '@/domain/usecases'
import { env } from '@/main/config'
import { Collection } from 'mongodb'
const uri = env.MONGO_URL
let usersCollection: Collection

const makeSut = (): UserRepository => {
  const sut = new UserRepository()
  return sut
}

const makeFakeUser = (): AddUserModel => ({
  name: 'any-name',
  email: 'any-email',
  password: 'any-password',
  role: 'any-role'
})

describe('UserRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(uri)
  })

  beforeEach(async () => {
    usersCollection = await MongoHelper.getCollection('users')
    await usersCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('add()', () => {
    it('should return user when registered on MongoDB', async () => {
      const sut = makeSut()
      const model = makeFakeUser()
      const user = await sut.add(model)
      expect(user.name).toEqual(model.name)
      expect(user.email).toEqual(model.email)
      expect(user.password).toEqual(model.password)
    })
  })

  describe('findByEmail()', () => {
    it('should return null when no user is found', async () => {
      const sut = makeSut()
      const user = await sut.findByEmail('any-email')
      expect(user).toBeNull()
    })

    it('should return user when user is found', async () => {
      const sut = makeSut()
      const model = makeFakeUser()
      await usersCollection.insertOne(model)
      const user = await sut.findByEmail(model.email)
      expect(user.name).toEqual(model.name)
      expect(user.email).toEqual(model.email)
      expect(user.password).toEqual(model.password)
    })
  })

  describe('findById()', () => {
    it('should return null when no user is found', async () => {
      const sut = makeSut()
      const user = await sut.findById('any-id')
      expect(user).toBeNull()
    })
  })
})
