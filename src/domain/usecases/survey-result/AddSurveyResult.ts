import { SurveyResultModel } from '@/domain/models'

export namespace AddSurveyResult {
  export type Params = {
    surveyId: string
    userId: string
    answer: string
    date: Date
  }

  export type Result = SurveyResultModel
}

export interface AddSurveyResult {
  add(data: AddSurveyResult.Params): Promise<AddSurveyResult.Result>
}
