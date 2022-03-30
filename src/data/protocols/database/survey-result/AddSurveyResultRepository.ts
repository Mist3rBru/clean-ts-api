import { AddSurveyResult } from '@/domain/usecases'

export namespace AddSurveyResultRepository {
  export type Params = AddSurveyResult.Params
}

export interface AddSurveyResultRepository {
  add(data: AddSurveyResultRepository.Params): Promise<void>
}
