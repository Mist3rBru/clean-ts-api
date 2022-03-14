import { SurveyModel } from '@/domain/models'

export interface ListSurveysRepository {
  list (): Promise<SurveyModel[]>
}
