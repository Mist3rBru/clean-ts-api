import { LogErrorRepository } from '@/data/protocols'
import { MongoHelper } from './MongoHelper'

export class LogRepository implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({ stack, date: new Date() })
  }
}
