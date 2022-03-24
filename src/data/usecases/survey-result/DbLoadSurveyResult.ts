import { LoadSurveyResultRepository } from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'
import { LoadSurveyResult } from '@/domain/usecases'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async load (surveyId: string, userId: string): Promise<SurveyResultModel> {
    await this.loadSurveyResultRepository.load(surveyId, userId)
    return null
  }
}
