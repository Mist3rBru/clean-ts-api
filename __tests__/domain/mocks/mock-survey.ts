import { SurveyModel } from '@/domain/models'
import { AddSurvey } from '@/domain/usecases'
import faker from '@faker-js/faker'

export const mockSurveyModel = (): SurveyModel => ({
  id: faker.datatype.uuid(),
  question: faker.random.words(),
  answers: [{
    image: faker.image.imageUrl(),
    answer: faker.random.word()
  }, {
    image: faker.image.imageUrl(),
    answer: faker.random.word()
  }],
  date: faker.date.recent()
})

export const mockSurveyList = (): SurveyModel[] => ([
  {
    id: faker.datatype.uuid(),
    question: faker.random.words(),
    answers: [{
      image: faker.image.imageUrl(),
      answer: faker.random.word()
    }],
    date: faker.date.recent()
  }, {
    id: faker.datatype.uuid(),
    question: faker.random.words(),
    answers: [{
      image: faker.image.imageUrl(),
      answer: faker.random.word()
    }],
    date: faker.date.recent()
  }
])

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: faker.random.words(),
  answers: [{
    image: faker.image.imageUrl(),
    answer: faker.random.word()
  }, {
    image: faker.image.imageUrl(),
    answer: faker.random.word()
  }],
  date: faker.date.recent()
})

export const mockAddSurveyParamsList = (): AddSurvey.Params[] => ([
  {
    question: faker.random.words(),
    answers: [{
      image: faker.image.imageUrl(),
      answer: faker.random.word()
    }],
    date: faker.date.recent()
  },
  {
    question: faker.random.words(),
    answers: [{
      image: faker.image.imageUrl(),
      answer: faker.random.word()
    }],
    date: faker.date.recent()
  }

])
