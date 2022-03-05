import { UserModel } from '@/domain/models'
import { AddUserModel } from '@/domain/usecases'

export interface AddUserRepository {
  add: (model: AddUserModel) => Promise<UserModel>
}
