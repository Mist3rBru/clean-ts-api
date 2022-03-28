import { DbLoadSurveyResult } from '@/data/usecases'
import { LoadSurveyResult } from '@/domain/usecases'
import { SurveyResultRepository, SurveyRepository } from '@/infra/database/mongodb'

export const makeDbLoadSurveyResult = (): LoadSurveyResult => {
  const loadSurveyResultRepository = new SurveyResultRepository()
  const findSurveyByIdRepository = new SurveyRepository()
  return new DbLoadSurveyResult(loadSurveyResultRepository, findSurveyByIdRepository)
}
