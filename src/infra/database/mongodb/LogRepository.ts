import { MongoHelper } from '@/infra/database/mongodb'
import { LogErrorRepository } from '@/data/protocols'

export class LogRepository implements LogErrorRepository {
  async log (stack: string): Promise<void> {
    const logsCollection = await MongoHelper.getCollection('logs')
    await logsCollection.insertOne({ stack, date: new Date() })
  }
}
