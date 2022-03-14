import { SurveyModel } from '@/domain/models'

export interface AddSurvey {
  add (survey: SurveyModel): Promise<void>
}
