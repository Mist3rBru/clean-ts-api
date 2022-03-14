import { AddSurvey } from '@/domain/usecases'
import { SurveyModel } from '@/domain/models'
import { AddSurveyRepository } from '@/data/protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository
  ) {}

  async add (survey: SurveyModel): Promise<void> {
    await this.addSurveyRepository.add(survey)
  }
}
