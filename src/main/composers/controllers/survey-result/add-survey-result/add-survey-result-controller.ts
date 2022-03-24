import { makeLogControllerDecorator } from '@/main/composers/decorators/log-decorator-composer'
import { makeDbFindSurveyById, makeDbAddSurveyResult } from '@/main/composers/usecases'
import { AddSurveyResultController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeAddSurveyResultController = (): Controller => {
  const addSurveyResult = makeDbAddSurveyResult()
  const findSurveyById = makeDbFindSurveyById()
  const controller = new AddSurveyResultController(findSurveyById, addSurveyResult)
  return makeLogControllerDecorator(controller)
}
