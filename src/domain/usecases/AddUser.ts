import { UserModel } from '@/domain/models'

export interface AddUserModel {
  name: string
  email: string
  password: string
}

export interface AddUser {
  add: (account: AddUserModel) => Promise<UserModel>
}
