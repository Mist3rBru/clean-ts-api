import { SurveyModel } from '@/domain/models'
import { AddSurveyParams } from '@/domain/usecases'

export const mockSurveyModel = (): SurveyModel => ({
  id: 'any-id',
  question: 'any-question',
  answers: [{
    image: 'any-image',
    answer: 'any-answer'
  }],
  date: new Date()
})

export const mockSurveyList = (): SurveyModel[] => ([
  {
    id: 'any-id',
    question: 'any-question',
    answers: [{
      image: 'any-image',
      answer: 'any-answer'
    }],
    date: new Date()
  }, {
    id: 'other-id',
    question: 'other-question',
    answers: [{
      image: 'other-image',
      answer: 'other-answer'
    }],
    date: new Date()
  }
])

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any-question',
  answers: [{
    image: 'any-image',
    answer: 'any-answer'
  }],
  date: new Date()
})

export const mockAddSurveyParamsList = (): AddSurveyParams[] => ([
  {
    question: 'any-question',
    answers: [{
      image: 'any-image',
      answer: 'any-answer'
    }],
    date: new Date()
  },
  {
    question: 'other-question',
    answers: [{
      image: 'other-image',
      answer: 'other-answer'
    }],
    date: new Date()
  }

])
