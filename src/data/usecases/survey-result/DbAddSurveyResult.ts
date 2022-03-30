import { AddSurveyResultRepository, LoadSurveyResultRepository } from '@/data/protocols'
import { AddSurveyResult } from '@/domain/usecases'

export class DbAddSurveyResult implements AddSurveyResult {
  constructor (
    private readonly addSurveyResultRepository: AddSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async add (data: AddSurveyResult.Params): Promise<AddSurveyResult.Result> {
    await this.addSurveyResultRepository.add(data)
    const survey = await this.loadSurveyResultRepository.load(data)
    return survey
  }
}
