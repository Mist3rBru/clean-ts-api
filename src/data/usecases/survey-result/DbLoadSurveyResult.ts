import { FindSurveyByIdRepository, LoadSurveyResultRepository } from '@/data/protocols'
import { SurveyResultModel } from '@/domain/models'
import { LoadSurveyResult } from '@/domain/usecases'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly findSurveyByIdRepository: FindSurveyByIdRepository
  ) {}

  async load (surveyId: string, userId: string): Promise<SurveyResultModel> {
    let surveyResult = await this.loadSurveyResultRepository.load(surveyId, userId)
    if (!surveyResult) {
      const survey = await this.findSurveyByIdRepository.findById(surveyId)
      surveyResult = {
        surveyId: survey.id,
        question: survey.question,
        answers: survey.answers.map(answer => Object.assign({}, answer, {
          count: 0,
          percent: 0,
          isCurrentUserAnswer: false
        })),
        date: survey.date
      }
    }
    return surveyResult
  }
}
