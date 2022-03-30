import { SurveyResultModel } from '@/domain/models'
import { LoadSurveyResult } from '@/domain/usecases'

export namespace LoadSurveyResultRepository {
  export type Params = LoadSurveyResult.Params
  export type Result = SurveyResultModel
}

export interface LoadSurveyResultRepository {
  load (data: LoadSurveyResultRepository.Params): Promise<LoadSurveyResultRepository.Result>
}
