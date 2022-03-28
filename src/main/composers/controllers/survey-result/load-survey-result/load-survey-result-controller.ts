import { makeLogControllerDecorator } from '@/main/composers/decorators'
import { makeDbFindSurveyById, makeDbLoadSurveyResult } from '@/main/composers/usecases'
import { LoadSurveyResultController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeLoadSurveyResultController = (): Controller => {
  const loadSurveyResult = makeDbLoadSurveyResult()
  const findSurveyById = makeDbFindSurveyById()
  const controller = new LoadSurveyResultController(findSurveyById, loadSurveyResult)
  return makeLogControllerDecorator(controller)
}
