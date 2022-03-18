import { UserRepository, MongoHelper } from '@/infra/database/mongodb'
import { env } from '@/main/config'
import { mockAddUserParams } from '@/tests/domain/mocks'
import { Collection, ObjectId } from 'mongodb'
const uri = env.MONGO_URL
let usersCollection: Collection

const makeSut = (): UserRepository => {
  const sut = new UserRepository()
  return sut
}

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
      const model = mockAddUserParams()
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
      const model = mockAddUserParams()
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
      const user = await sut.findById(new ObjectId())
      expect(user).toBeNull()
    })

    it('should return user when user is found', async () => {
      const sut = makeSut()
      const model = mockAddUserParams()
      const fakeUser = await usersCollection.insertOne(model)
      const user = await sut.findById(fakeUser.insertedId)
      expect(user.name).toEqual(model.name)
      expect(user.email).toEqual(model.email)
      expect(user.password).toEqual(model.password)
    })
  })
})
