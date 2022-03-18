import { DbListSurveys } from '@/data/usecases'
import { ListSurveysController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/composers/decorators'
import { SurveyRepository } from '@/infra/database/mongodb'

export const makeListSurveysController = (): Controller => {
  const listSurveysRepository = new SurveyRepository()
  const listSurveys = new DbListSurveys(listSurveysRepository)
  const controller = new ListSurveysController(listSurveys)
  return makeLogControllerDecorator(controller)
}
