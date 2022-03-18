import { DbSaveSurveyResult } from '@/data/usecases'
import { SurveyResultRepository } from '@/infra/database/mongodb'

export const makeDbSaveSurveyResult = (): DbSaveSurveyResult => {
  const findSurveyByIdRepository = new SurveyResultRepository()
  return new DbSaveSurveyResult(findSurveyByIdRepository)
}
