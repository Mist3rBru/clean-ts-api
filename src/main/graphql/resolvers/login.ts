import { makeLoginController } from '@/main/composers/controllers'

export default {
  Query: {
    async login (parent: any, args: any) {
      const loginController = makeLoginController()
      const httpResponse = await loginController.handle(args)
      return httpResponse.body
    }
  }
}
