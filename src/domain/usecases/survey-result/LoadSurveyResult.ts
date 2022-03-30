import { SurveyResultModel } from '@/domain/models'

export namespace LoadSurveyResult {
  export type Params = {
    surveyId: string
    userId: string
  }
  export type Result = SurveyResultModel
}

export interface LoadSurveyResult {
  load(data: LoadSurveyResult.Params): Promise<LoadSurveyResult.Result>
}
