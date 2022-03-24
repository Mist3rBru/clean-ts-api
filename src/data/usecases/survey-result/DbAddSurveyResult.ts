import { AddSurveyResultRepository, FindSurveyResultByIdRepository } from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'
import { AddSurveyResult, AddSurveyResultParams } from '@/domain/usecases'

export class DbAddSurveyResult implements AddSurveyResult {
  constructor (
    private readonly addSurveyResultRepository: AddSurveyResultRepository,
    private readonly findSurveyResultByIdRepository: FindSurveyResultByIdRepository
  ) {}

  async add (model: AddSurveyResultParams): Promise<SurveyResultModel> {
    await this.addSurveyResultRepository.add(model)
    const survey = await this.findSurveyResultByIdRepository.findById(model.surveyId, model.userId)
    return survey
  }
}
