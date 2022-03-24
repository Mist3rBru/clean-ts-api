import { SurveyResultModel } from '@/domain/models'

export interface LoadSurveyResultRepository {
  load (surveyId: string, userId: string): Promise<SurveyResultModel>
}
