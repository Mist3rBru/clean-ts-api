import { SurveyResultModel } from '@/domain/models'
import { AddSurveyResultParams } from '@/domain/usecases'

export const mockAddSurveyResultParams = (): AddSurveyResultParams => ({
  userId: 'ded3e2a46879db2bfc7f19d7',
  surveyId: 'd58e57670afae38d70f8546f',
  answer: 'any-answer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'd58e57670afae38d70f8546f',
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
