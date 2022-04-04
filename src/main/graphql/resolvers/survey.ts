import { adaptResolver } from '@/main/adapters'
import { makeAddSurveyController, makeListSurveysController } from '@/main/composers/controllers'

export default {
  Query: {
    surveys: async () => adaptResolver(makeListSurveysController())
  },

  Mutation: {
    survey: async (parent: any, args: any) => adaptResolver(makeAddSurveyController(), args)
  }
}
