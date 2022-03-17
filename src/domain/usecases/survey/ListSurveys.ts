import { SurveyModel } from '@/domain/models'

export interface ListSurveys {
  list (): Promise<SurveyModel[]>
}
