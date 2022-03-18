import { makeLogControllerDecorator } from '@/main/composers/decorators/log-decorator-composer'
import { makeDbFindSurveyById, makeDbSaveSurveyResult } from '@/main/composers/usecases'
import { SaveSurveyResultController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
  const saveSurveyResult = makeDbSaveSurveyResult()
  const findSurveyById = makeDbFindSurveyById()
  const controller = new SaveSurveyResultController(findSurveyById, saveSurveyResult)
  return makeLogControllerDecorator(controller)
}
