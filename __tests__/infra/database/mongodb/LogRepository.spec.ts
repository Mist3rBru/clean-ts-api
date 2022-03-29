import { LogRepository, MongoHelper } from '@/infra/database/mongodb'
import { Collection } from 'mongodb'
import { env } from '@/main/config'
const uri = env.MONGO_URL
let logsCollection: Collection

const makeSut = (): LogRepository => {
  return new LogRepository()
}

describe('LogRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(uri)
    logsCollection = await MongoHelper.getCollection('logs')
  })

  beforeEach(async () => {
    await logsCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should register error on success', async () => {
    const sut = makeSut()
    await sut.log('any-stack')
    const count = await logsCollection.countDocuments()
    expect(count).toBe(1)
  })
})
