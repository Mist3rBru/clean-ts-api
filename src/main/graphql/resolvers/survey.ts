import { adaptResolver } from '@/main/adapters'
import { makeListSurveysController } from '@/main/composers/controllers'

export default {
  Query: {
    surveys: async () => adaptResolver(makeListSurveysController())
  }
}
