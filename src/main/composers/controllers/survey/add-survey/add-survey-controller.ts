import { SurveyRepository } from '@/infra/database/mongodb'
import { DbAddSurvey } from '@/data/usecases'
import { makeLogControllerDecorator } from '@/main/composers/decorators'
import { makeAddSurveyValidation } from '@/main/composers/controllers'
import { AddSurveyController } from '@/presentation/controllers'
import { Controller } from '@/presentation/protocols'

export const makeAddSurveyController = (): Controller => {
  const addSurveyRepository = new SurveyRepository()
  const dbAddSurvey = new DbAddSurvey(addSurveyRepository)
  const validation = makeAddSurveyValidation()
  const controller = new AddSurveyController(validation, dbAddSurvey)
  return makeLogControllerDecorator(controller)
}
