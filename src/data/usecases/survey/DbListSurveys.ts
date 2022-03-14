import { ListSurveysRepository } from '@/data/protocols'
import { SurveyModel } from '@/domain/models'
import { ListSurveys } from '@/domain/usecases'

export class DbListSurveys implements ListSurveys {
  constructor (
    private readonly listSurveysRepository: ListSurveysRepository
  ) {}

  async list (): Promise<SurveyModel[]> {
    await this.listSurveysRepository.list()
    return null
  }
}
