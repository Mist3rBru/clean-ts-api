import { AddSurveyRepository } from '@/data/protocols'
import { SurveyModel } from '@/domain/models'
import { MongoHelper } from '@/infra/database/mongodb'

export class SurveyRepository implements AddSurveyRepository {
  async add (model: SurveyModel): Promise<void> {
    const userCollection = await MongoHelper.getCollection('survey')
    await userCollection.insertOne(model)
  }
}
