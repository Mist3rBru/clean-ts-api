import { UserModel } from '@/domain/models'

export type AddUserModel = {
  name: string
  email: string
  password: string
  role?: string
}

export interface AddUser {
  add (user: AddUserModel): Promise<UserModel>
}
