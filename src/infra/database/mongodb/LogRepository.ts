import { MongoHelper } from '@/infra/database/mongodb'
import { LogErrorRepository } from '@/data/protocols'

export class LogRepository implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({ stack, date: new Date() })
  }
}
