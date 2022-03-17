import { UserModel } from '@/domain/models'

export type AddUserModel = Omit<UserModel, 'id'>

export interface AddUser {
  add (user: AddUserModel): Promise<UserModel>
}
