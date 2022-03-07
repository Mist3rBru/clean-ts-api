import { MongoHelper } from './MongoHelper'
import { env } from '@/main/config'
const uri = env.MONGO_URL

describe('MongoHelper', () => {
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  
  it('should connect to MongoDB', async () => {
    await MongoHelper.connect(uri)
    expect(MongoHelper.client).toBeTruthy()
  })

  it('should disconnect to MongoDB', async () => {
    await MongoHelper.disconnect()
    expect(MongoHelper.client).toBeFalsy()
  })

  it('should reconnect and return collection to MongoDB', async () => {
    await MongoHelper.connect(uri)
    await MongoHelper.disconnect()
    const collection = await MongoHelper.getCollection('users')
    expect(MongoHelper.client).toBeTruthy()
    expect(collection).toBeTruthy()
  })

  it('should return the data collection without _id', async () => {
    const collection = {
      _id: 'any-id',
      email: 'any-email'
    }
    const newCollection = MongoHelper.map(collection)
    expect(newCollection).toEqual({
      id: collection._id, 
      email: collection.email
    })
  })
})
