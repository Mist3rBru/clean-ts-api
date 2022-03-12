import { SurveyModel } from '@/domain/models'

export interface AddSurveyModel {
  img: string
}

export interface AddSurvey {
  add: (survey: AddSurveyModel) => Promise<SurveyModel>
}
