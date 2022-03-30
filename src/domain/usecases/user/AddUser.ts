import { UserModel } from '@/domain/models'

export namespace AddUser {
  export type Params = Omit<UserModel, 'id'>
  export type Result = UserModel
}

export interface AddUser {
  add(data: AddUser.Params): Promise<AddUser.Result>
}
