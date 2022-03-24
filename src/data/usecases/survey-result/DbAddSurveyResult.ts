import { AddSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'
import { AddSurveyResult, AddSurveyResultParams } from '@/domain/usecases'

export class DbAddSurveyResult implements AddSurveyResult {
  constructor (
    private readonly addSurveyResultRepository: AddSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async add (model: AddSurveyResultParams): Promise<SurveyResultModel> {
    await this.addSurveyResultRepository.add(model)
    const survey = await this.loadSurveyResultRepository.load(model.surveyId, model.userId)
    return survey
  }
}
