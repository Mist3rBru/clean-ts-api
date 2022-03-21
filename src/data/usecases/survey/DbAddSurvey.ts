import { AddSurvey, AddSurveyParams } from '@/domain/usecases'
import { AddSurveyRepository } from '@/data/protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}

  async add (survey: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(survey)
  }
}
