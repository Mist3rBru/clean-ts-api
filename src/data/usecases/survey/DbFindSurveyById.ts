import { FindSurveyByIdRepository } from '@/data/protocols'
import { SurveyModel } from '@/domain/models'
import { FindSurveyById } from '@/domain/usecases'

export class DbFindSurveyById implements FindSurveyById {
  constructor (
    private readonly findSurveyByIdRepository: FindSurveyByIdRepository
  ) {}

  async findById (id: string): Promise<SurveyModel> {
    const survey = await this.findSurveyByIdRepository.findById(id)
    return survey
  }
}
