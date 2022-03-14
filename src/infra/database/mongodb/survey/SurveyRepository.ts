import { AddSurveyRepository, ListSurveysRepository } from '@/data/protocols'
import { SurveyModel } from '@/domain/models'
import { MongoHelper } from '@/infra/database/mongodb'

export class SurveyRepository implements AddSurveyRepository, ListSurveysRepository {
  async add (model: SurveyModel): Promise<void> {
    const userCollection = await MongoHelper.getCollection('survey')
    await userCollection.insertOne(model)
  }

  async list (): Promise<SurveyModel[]> {
    const userCollection = await MongoHelper.getCollection('survey')
    const collection = await userCollection.find().toArray()
    return MongoHelper.mapCollection(collection)
  }
}
