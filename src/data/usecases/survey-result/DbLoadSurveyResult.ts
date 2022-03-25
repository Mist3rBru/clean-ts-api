import { FindSurveyByIdRepository, LoadSurveyResultRepository } from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'
import { LoadSurveyResult } from '@/domain/usecases'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly findSurveyByIdRepository: FindSurveyByIdRepository
  ) {}

  async load (surveyId: string, userId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.loadSurveyResultRepository.load(surveyId, userId)
    if (!surveyResult) {
      await this.findSurveyByIdRepository.findById(surveyId)
    }
    return surveyResult
  }
}
