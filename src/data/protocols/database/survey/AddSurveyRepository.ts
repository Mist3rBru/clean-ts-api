import { AddSurvey } from '@/domain/usecases'

export namespace AddSurveyRepository {
  export type Params = AddSurvey.Params
}

export interface AddSurveyRepository {
  add: (data: AddSurveyRepository.Params) => Promise<void>
}
