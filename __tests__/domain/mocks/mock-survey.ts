import { SurveyModel } from '@/domain/models'
import { AddSurveyParams } from '@/domain/usecases'

export const mockSurveyModel = (): SurveyModel => ({
  id: '248fc772a136f051d5eb67f8',
  question: 'any-question',
  answers: [{
    image: 'any-image',
    answer: 'any-answer'
  }, {
    image: 'other-image',
    answer: 'other-answer'
  }],
  date: new Date()
})

export const mockSurveyList = (): SurveyModel[] => ([
  {
    id: '248fc772a136f051d5eb67f8',
    question: 'any-question',
    answers: [{
      image: 'any-image',
      answer: 'any-answer'
    }],
    date: new Date()
  }, {
    id: 'ded3e2a46879db2bfc7f19d7',
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
  }, {
    image: 'other-image',
    answer: 'other-answer'
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
