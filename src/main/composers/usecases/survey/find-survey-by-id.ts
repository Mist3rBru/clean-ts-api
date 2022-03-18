import { DbFindSurveyById } from '@/data/usecases/survey/DbFindSurveyById'
import { SurveyRepository } from '@/infra/database/mongodb'

export const makeDbFindSurveyById = (): DbFindSurveyById => {
  const findSurveyByIdRepository = new SurveyRepository()
  return new DbFindSurveyById(findSurveyByIdRepository)
}
