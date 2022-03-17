import { AddSurveyRepository, ListSurveysRepository } from '@/data/protocols'
import { SurveyModel } from '@/domain/models'
import { AddSurveyModel, FindSurveyById } from '@/domain/usecases'
import { MongoHelper } from '@/infra/database/mongodb'
import { ObjectId } from 'mongodb'

export class SurveyRepository implements AddSurveyRepository, ListSurveysRepository, FindSurveyById {
  async add (model: AddSurveyModel): Promise<void> {
    const userCollection = await MongoHelper.getCollection('survey')
    await userCollection.insertOne(model)
  }

  async list (): Promise<SurveyModel[]> {
    const userCollection = await MongoHelper.getCollection('survey')
    const surveys = await userCollection.find().toArray()
    return MongoHelper.mapCollection(surveys)
  }

  async findById (id: string): Promise<SurveyModel> {
    const userCollection = await MongoHelper.getCollection('survey')
    const survey = await userCollection.findOne(new ObjectId(id))
    return MongoHelper.map(survey)
  }
}
