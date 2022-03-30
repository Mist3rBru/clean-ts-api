import { FindSurveyByIdRepository } from '@/data/protocols'
import { FindSurveyById } from '@/domain/usecases'

export class DbFindSurveyById implements FindSurveyById {
  constructor (
    private readonly findSurveyByIdRepository: FindSurveyByIdRepository
  ) {}

  async findById (id: string): Promise<FindSurveyById.Result> {
    const survey = await this.findSurveyByIdRepository.findById(id)
    return survey
  }
}
