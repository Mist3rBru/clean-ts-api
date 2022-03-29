import { SurveyResultModel } from '@/domain/models'
import { AddSurveyResultParams } from '@/domain/usecases'
import faker from '@faker-js/faker'

export const mockAddSurveyResultParams = (): AddSurveyResultParams => ({
  userId: faker.datatype.hexaDecimal(24).substring(2, 26),
  surveyId: faker.datatype.hexaDecimal(24).substring(2, 26),
  answer: faker.random.word(),
  date: faker.date.recent()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.datatype.hexaDecimal(24).substring(2, 26),
  question: faker.random.words(),
  answers: [{
    answer: faker.random.word(),
    count: faker.datatype.number({ min: 0, max: 1000 }),
    percent: faker.datatype.number({ min: 0, max: 100 })
  },
  {
    answer: faker.random.word(),
    count: faker.datatype.number({ min: 0, max: 1000 }),
    percent: faker.datatype.number({ min: 0, max: 100 })
  }],
  date: faker.date.recent()
})

export const mockEmptySurveyResultModel = (): SurveyResultModel => ({
  surveyId: faker.datatype.hexaDecimal(24).substring(2, 26),
  question: faker.random.words(),
  answers: [{
    image: faker.image.imageUrl(),
    answer: faker.random.word(),
    count: 0,
    percent: 0
  },
  {
    image: faker.image.imageUrl(),
    answer: faker.random.word(),
    count: 0,
    percent: 0
  }],
  date: faker.date.recent()
})
