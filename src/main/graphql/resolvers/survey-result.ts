import { adaptResolver } from '@/main/adapters'
import { makeLoadSurveyResultController, makeAddSurveyResultController } from '@/main/composers/controllers'

export default {
  Query: {
    surveyResult: async (parent: any, args: any, context: any) => adaptResolver(makeLoadSurveyResultController(), args, context)
  },

  Mutation: {
    addSurveyResult: async (parent: any, args: any, context: any) => adaptResolver(makeAddSurveyResultController(), args, context)
  }
}
