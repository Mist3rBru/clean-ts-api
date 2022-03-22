export const SurveyResultSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    surveyId: {
      type: 'string'
    },
    userId: {
      type: 'string'
    },
    answer: {
      type: 'string'
    },
    date: {
      type: 'string'
    }
  }
}
