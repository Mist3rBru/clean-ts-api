import { SurveyResultModel } from '@/domain/models'

export type AddSurveyResultParams = {
  surveyId: string
  userId: string
  answer: string
  date: Date
}

export interface AddSurveyResult {
  add(model: AddSurveyResultParams): Promise<SurveyResultModel>
}
