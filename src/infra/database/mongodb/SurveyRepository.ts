import { AddSurveyRepository, FindSurveyByIdRepository, ListSurveysRepository } from '@/data/protocols'
import { MongoHelper } from '@/infra/database/mongodb'
import { ObjectId } from 'mongodb'

export class SurveyRepository implements AddSurveyRepository, ListSurveysRepository, FindSurveyByIdRepository {
  async add (data: AddSurveyRepository.Params): Promise<void> {
    const userCollection = await MongoHelper.getCollection('survey')
    await userCollection.insertOne(data)
  }

  async list (): Promise<ListSurveysRepository.Result> {
    const userCollection = await MongoHelper.getCollection('survey')
    const surveys = await userCollection.find().toArray()
    return MongoHelper.mapCollection(surveys)
  }

  async findById (id: string): Promise<FindSurveyByIdRepository.Result> {
    const userCollection = await MongoHelper.getCollection('survey')
    const survey = await userCollection.findOne(new ObjectId(id))
    return survey ? MongoHelper.map(survey) : null
  }
}
