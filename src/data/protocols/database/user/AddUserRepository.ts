import { UserModel } from '@/domain/models'
import { AddUserParams } from '@/domain/usecases'

export interface AddUserRepository {
  add (model: AddUserParams): Promise<UserModel>
}
