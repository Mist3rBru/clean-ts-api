import { UserModel } from '@/domain/models'
import { AddUser } from '@/domain/usecases'

export namespace AddUserRepository {
  export type Params = AddUser.Params
  export type Result = UserModel
}

export interface AddUserRepository {
  add (data: AddUserRepository.Params): Promise<AddUserRepository.Result>
}
