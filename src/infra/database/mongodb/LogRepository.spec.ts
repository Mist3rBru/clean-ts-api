import { LogRepository, MongoHelper } from '@/infra/database/mongodb'
import { Collection } from 'mongodb'
import { env } from '@/main/config'
const uri = env.MONGO_URL
let errorCollection: Collection

const makeSut = (): LogRepository => {
  const sut = new LogRepository()
  return sut
}

describe('LogRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(uri)
    errorCollection = await MongoHelper.getCollection('errors')
  })

  beforeEach(async () => {
    await errorCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should register error on success', async () => {
    const sut = makeSut()
    await sut.log('any-stack')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
