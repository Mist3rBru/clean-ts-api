import { SaveSurveyResultRepository } from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/usecases'
import { MongoHelper } from '@/infra/database/mongodb'

export class SurveyResultRepository implements SaveSurveyResultRepository {
  async save(model: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    const survey = await surveyCollection.findOneAndUpdate(
      {
        surveyId: model.surveyId,
        userId: model.userId,
      },
      {
        $set: {
          answer: model.answer,
          date: model.date,
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    )
    return MongoHelper.map(survey.value)
  }
}
