import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/usecases'

export interface SaveSurveyResultRepository {
  save(survey: SaveSurveyResultParams): Promise<SurveyResultModel>
}
