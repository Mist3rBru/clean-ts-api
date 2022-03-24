import { AddSurveyResultParams } from '@/domain/usecases'

export interface AddSurveyResultRepository {
  add(survey: AddSurveyResultParams): Promise<void>
}
