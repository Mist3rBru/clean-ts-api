import { AddUserModel } from '@/domain/usecases'

export class DbAddUser {
  constructor (
    private readonly encrypter: any
  ) {}

  async add (model: AddUserModel): Promise<any> {
    await this.encrypter.hash(model.password)
    return ''
  }
}
