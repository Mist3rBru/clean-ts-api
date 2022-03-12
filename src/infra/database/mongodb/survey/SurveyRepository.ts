import { AddSurveyRepository } from '@/data/protocols'
import { AddSurveyModel } from '@/domain/usecases'
import { MongoHelper } from '@/infra/database/mongodb'

export class SurveyRepository implements AddSurveyRepository {
  async add (model: AddSurveyModel): Promise<void> {
    const userCollection = await MongoHelper.getCollection('surveys')
    await userCollection.insertOne(model)
  }
}
