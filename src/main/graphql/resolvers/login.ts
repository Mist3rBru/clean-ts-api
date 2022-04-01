import { adaptResolver } from '@/main/adapters'
import { makeLoginController, makeSignUpController } from '@/main/composers/controllers'

export default {
  Query: {
    login: async (parent: any, args: any) => adaptResolver(makeLoginController(), args)
  },

  Mutation: {
    signUp: async (parent: any, args: any) => adaptResolver(makeSignUpController(), args)
  }
}
