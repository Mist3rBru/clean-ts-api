import { SurveyModel } from '@/domain/models'

export namespace FindSurveyById {
  export type Result = SurveyModel
}

export interface FindSurveyById {
  findById (id: string): Promise<FindSurveyById.Result>
}
