import { SurveyResultModel } from '@/domain/models'

export interface LoadSurveyResult {
  load(surveyId: string, userId: string): Promise<SurveyResultModel>
}
