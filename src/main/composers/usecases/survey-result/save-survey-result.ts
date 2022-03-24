import { DbAddSurveyResult } from '@/data/usecases'
import { SurveyResultRepository } from '@/infra/database/mongodb'

export const makeDbAddSurveyResult = (): DbAddSurveyResult => {
  const addSurveyResultRepository = new SurveyResultRepository()
  const findSurveyResultByIdRepository = new SurveyResultRepository()
  return new DbAddSurveyResult(addSurveyResultRepository, findSurveyResultByIdRepository)
}
