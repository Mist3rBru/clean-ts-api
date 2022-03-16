import { SurveyResultModel } from '@/domain/models'

type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>

export interface SaveSurveyResult {
  save (survey: SaveSurveyResultModel): Promise<SurveyResultModel>
}
