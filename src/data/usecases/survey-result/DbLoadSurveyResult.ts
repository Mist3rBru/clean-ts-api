import { FindSurveyByIdRepository, LoadSurveyResultRepository } from '@/data/protocols'
import { LoadSurveyResult } from '@/domain/usecases'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly findSurveyByIdRepository: FindSurveyByIdRepository
  ) {}

  async load (data: LoadSurveyResult.Params): Promise<LoadSurveyResult.Result> {
    let surveyResult = await this.loadSurveyResultRepository.load(data)
    if (!surveyResult) {
      const survey = await this.findSurveyByIdRepository.findById(data.surveyId)
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
