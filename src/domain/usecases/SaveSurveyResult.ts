import { SurveyResultModel } from '@/domain/models'

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>

export interface SaveSurveyResult {
  save (model: SaveSurveyResultModel): Promise<SurveyResultModel>
}
