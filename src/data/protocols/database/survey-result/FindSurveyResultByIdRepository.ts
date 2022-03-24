import { SurveyResultModel } from '@/domain/models'

export interface FindSurveyResultByIdRepository {
  findById (surveyId: string, userId: string): Promise<SurveyResultModel>
}
