import { UserModel } from '@/domain/models'

export namespace FindUserByToken {
  export type Params = {
    token: string
    role?: string
  }
  export type Result = UserModel
}

export interface FindUserByToken {
  findByToken (data: FindUserByToken.Params): Promise<FindUserByToken.Result>
}
