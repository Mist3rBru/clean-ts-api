import { AddUserRepository } from '@/data/protocols'
import { AddUserModel } from '@/domain/usecases'
import { UserModel } from '@/domain/models'

export class UserRepository implements AddUserRepository {
  async add (model: AddUserModel): Promise<UserModel> {
    return {
      id: 'any-id',
      name: model.name,
      email: model.email
    }
  }
}
