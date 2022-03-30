import { SurveyModel } from '@/domain/models'

export namespace ListSurveys {
  export type Result = SurveyModel[]
}

export interface ListSurveys {
  list (): Promise<ListSurveys.Result>
}
