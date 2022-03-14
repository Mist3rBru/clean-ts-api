export type SurveyAnswerModel = {
  image?: string
  answer: string
}

export type SurveyModel = {
  question: string
  answers: SurveyAnswerModel[]
  date: Date
}
