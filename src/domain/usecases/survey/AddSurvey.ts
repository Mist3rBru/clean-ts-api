import { SurveyModel } from '@/domain/models'

export namespace AddSurvey {
  export type Params = Omit<SurveyModel, 'id'>
}

export interface AddSurvey {
  add(data: AddSurvey.Params): Promise<void>
}
