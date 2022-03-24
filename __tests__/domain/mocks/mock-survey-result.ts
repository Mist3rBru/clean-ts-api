import { SurveyResultModel } from '@/domain/models'
import { AddSurveyResultParams } from '@/domain/usecases'

export const mockAddSurveyResultParams = (): AddSurveyResultParams => ({
  userId: 'any-user-id',
  surveyId: 'any-survey-id',
  answer: 'any-answer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any-survey-id',
  question: 'any-question,',
  answers: [{
    answer: 'any-answer',
    count: 4,
    percent: 40
  },
  {
    answer: 'other-answer',
    count: 6,
    percent: 60
  }],
  date: new Date()
})
