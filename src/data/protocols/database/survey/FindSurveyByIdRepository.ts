import { SurveyModel } from '@/domain/models'

export namespace FindSurveyByIdRepository {
  export type Result = SurveyModel
}

export interface FindSurveyByIdRepository {
  findById (id: string): Promise<FindSurveyByIdRepository.Result>
}
