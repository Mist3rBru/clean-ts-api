import { AddSurveyModel } from '@/domain/usecases'

export interface AddSurveyRepository {
  add: (survey: AddSurveyModel) => Promise<void>
}
