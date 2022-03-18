import { SurveyResultModel } from '@/domain/models'
import { SaveSurveyResultParams } from '@/domain/usecases'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  userId: 'any-user-id',
  surveyId: 'any-survey-id',
  answer: 'any-answer',
  date: new Date()
})

export const mockSaveSurveyResultParamsList = (): SaveSurveyResultParams[] => ([
  {
    userId: 'any-user-id',
    surveyId: 'any-survey-id',
    answer: 'any-answer',
    date: new Date()
  },
  {
    userId: 'any-user-id',
    surveyId: 'any-survey-id',
    answer: 'other-answer',
    date: new Date()
  }
])

export const mockSurveyResultModel = (): SurveyResultModel => ({
  id: 'any-id',
  surveyId: 'any-survey-id',
  userId: 'any-user-id',
  answer: 'any-answer',
  date: new Date()
})
