import { SurveyModel } from '@/domain/models'

export interface FindSurveyById {
  findById (id: string): Promise<SurveyModel>
}
