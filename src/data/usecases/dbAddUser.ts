import { AddUser, AddUserModel } from '@/domain/usecases'
import { UserModel } from '@/domain/models'
import { Encrypter } from '@/data/protocols'

export class DbAddUser implements AddUser {
  constructor (
    private readonly encrypter: Encrypter
  ) {}

  async add (model: AddUserModel): Promise<UserModel> {
    await this.encrypter.encrypt(model.password)
    return {
      id: 'any-id',
      name: model.name,
      email: model.email
    }
  }
}
