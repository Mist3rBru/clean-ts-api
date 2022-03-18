import { SurveyResultModel } from '@/domain/models'

export type SaveSurveyResultParams = Omit<SurveyResultModel, 'id'>

export interface SaveSurveyResult {
  save(model: SaveSurveyResultParams): Promise<SurveyResultModel>
}
