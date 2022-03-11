import { Controller } from '@/presentation/protocols'
import { LogRepository } from '@/infra/database/mongodb'
import { LogControllerDecorator } from '@/main/decorators'

export const makeLogControllerDecorator = (controller: Controller): LogControllerDecorator => {
  const logErrorRepository = new LogRepository()
  return new LogControllerDecorator(controller, logErrorRepository)
}
