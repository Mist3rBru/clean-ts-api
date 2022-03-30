import { ListSurveysRepository } from '@/data/protocols'
import { ListSurveys } from '@/domain/usecases'

export class DbListSurveys implements ListSurveys {
  constructor (
    private readonly listSurveysRepository: ListSurveysRepository
  ) {}

  async list (): Promise<ListSurveys.Result> {
    const list = await this.listSurveysRepository.list()
    return list
  }
}
