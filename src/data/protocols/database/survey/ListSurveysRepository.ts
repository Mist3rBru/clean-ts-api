import { SurveyModel } from '@/domain/models'

export namespace ListSurveysRepository {
  export type Result =SurveyModel[]
}

export interface ListSurveysRepository {
  list (): Promise<ListSurveysRepository.Result>
}
