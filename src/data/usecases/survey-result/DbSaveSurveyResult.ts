import { SaveSurveyResultRepository } from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResult, SaveSurveyResultModel } from '@/domain/usecases'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {}

  async save (model: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const survey = await this.saveSurveyResultRepository.save(model)
    return survey
  }
}
